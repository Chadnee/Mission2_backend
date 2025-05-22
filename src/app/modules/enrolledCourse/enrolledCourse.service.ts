import { grade } from './enrolledCourse.const';
import { Student } from './../student/student.scemaAndModel';
import status from "http-status";
import AppError from "../../Error/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.modelAndSchema";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.schemaAndModel";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semestersRegistration/semesterRegistration.modelAndSchema";
import { lookup } from 'dns';
import { Course } from '../course/course.schemaAndModel';
import { Faculty } from '../faculty/faculty.schemaAndModule';
import { calculateGradePoints } from './endCourse.utils';

const createEnrolledCourseIntoDB = async(userId:string, payload: TEnrolledCourse) => {
     const {offeredCourse} = payload;
     //check if offered course is exist
     const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
     if(!isOfferedCourseExist){
        throw new AppError(status.NOT_FOUND, "This offered course is not exist")
     };
     if(isOfferedCourseExist.maxCapacity <= 0){
        throw new AppError(status.CONFLICT, "Enrollment failed: course capacity is full1")
     }

     //check if the student is already enrolled!
     const student = await Student.findOne({id: userId});
      const student_id = student?._id
     const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        offeredCourse,
        student: student_id
     });
    //  console.log(student, student_id, isStudentAlreadyEnrolled)
     if(isStudentAlreadyEnrolled){
        throw new AppError (status.FORBIDDEN, "This student is already enrolled")
     }
      const semsesterRegistration = await SemesterRegistration.findById(isOfferedCourseExist.semesterRegistration).select('maxCredit');
      
      // aggregate for finding total credit of a student in same semester inoffered course
      const enrolledCourse = await EnrolledCourse.aggregate([
         {
            $match: {
               semesterRegistration: isOfferedCourseExist.semesterRegistration,
               student: student_id,
            },
           
         },
         {
            $lookup: {
               from:'courses',
               localField:'course',
               foreignField:'_id',
               as:'enrolledCourseData'
            }
         },
         {
            $unwind: '$enrolledCourseData',
         },
         {
            $group: {
               _id: null,
               totalEnrolledCredits: {$sum:'$enrolledCourseData.credits'}
            }
         },
         {
            $project: {
               _id: 0,
               totalEnrolledCredits: 1
            }
         }
       ])
       
      console.log('b',enrolledCourse)
      const totalCredits = enrolledCourse.length>0?enrolledCourse[0].totalEnrolledCredits : 0
     
      const course = await Course.findById(isOfferedCourseExist.course);

      if(totalCredits && semsesterRegistration?.maxCredit 
         && totalCredits+course){
            throw new AppError(status.BAD_REQUEST, "You have exceeded maximum number of credits!")
         }
        const session = await mongoose.startSession();
     try{
         session.startTransaction();
         const result = await EnrolledCourse.create([{
                semesterRegistration:isOfferedCourseExist?.semesterRegistration,
                academicSemester:isOfferedCourseExist?.academicSemester,
                academicDepartment: isOfferedCourseExist?.academicDepartment,
                offeredCourse:offeredCourse,
                academicFaculty:isOfferedCourseExist?.academicFaculty,
                course: isOfferedCourseExist?.course,
                student: student_id,
                faculty: isOfferedCourseExist?.faculty,
         }], {session});

         if(!result){
            throw new AppError(status.BAD_REQUEST, "Course enrolling is failed!")
         };
         const maxCapacity = isOfferedCourseExist?.maxCapacity;
         await OfferedCourse.findByIdAndUpdate(offeredCourse,
            {maxCapacity: maxCapacity -1}
         );
         await session.commitTransaction();
         await session.endSession();
         return result;
     }catch(err){
         await session.abortTransaction();
         await session.endSession();
         throw new AppError(status.BAD_REQUEST, err);
     }

};

const updateEnrolledCourseMarksIntoDB = async(
   facultyId:string, payload: Partial<TEnrolledCourse>
) => {
   const {semesterRegistration, offeredCourse, student, courseMarks} = payload;
    
   // console.log(facultyId, payload)
   const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
   if(!isSemesterRegistrationExists){
      throw new AppError(status.BAD_REQUEST, "No semseter registration is found!")
   };
   const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
   if(!isOfferedCourseExists){
      throw new AppError(status.BAD_REQUEST, "No offered course is found!")
   };
   const isStudentExists = await Student.findById(student);
   if(!isStudentExists){
      throw new AppError(status.BAD_REQUEST, "No student is found!")
   };

   const faculty = await Faculty.findOne({id: facultyId});
      if(!faculty){
      throw new AppError(status.BAD_REQUEST, "No faculty is found, you are forbidden!")
   };
   const isCourseBelongToFaculty = await EnrolledCourse.findOne({
      semesterRegistration,
      offeredCourse,
      student,
      faculty: faculty?._id,
   })
   //console.log(isCourseBelongToFaculty);
   if(!isCourseBelongToFaculty){
      throw new AppError(status.FORBIDDEN, 'You are forbidden')
   }

   const modifiedData:Record<string, unknown> = {
    ...courseMarks,
   };
   if(courseMarks?.finalTerm){
      const {classTest1, classTest2, midTerm1, finalTerm} = courseMarks;
      const totalMarks = classTest1 + classTest2 + midTerm1 + finalTerm;
      //when we count all of them seperately as 100 but want to get all of them in a 100 then convert them as percentage
      // Math.ceil(classTest1* 0.1) +  //10% |
      // Math.ceil(midTerm1* 0.3) +    //30% |
      // Math.ceil(classTest2* 0.1) +  //10% |
      // Math.ceil(finalTerm* 0.5)     //50% | = 100

      const result = calculateGradePoints(totalMarks);
      console.log(result, totalMarks)

      modifiedData.grade = result.grade;
      modifiedData.gradePoints = result.gradePoints;
      modifiedData.isCompleted = true
     
   } 
   //console.log(modifiedData)
  if(courseMarks && Object.keys(courseMarks).length){
   for(const[key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
   }
  }
   const result =await EnrolledCourse.findByIdAndUpdate(
      isCourseBelongToFaculty._id, modifiedData,
      {new: true}
   );
   return result;
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB
}