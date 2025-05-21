import { Student } from './../student/student.scemaAndModel';
import status from "http-status";
import AppError from "../../Error/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.modelAndSchema";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.schemaAndModel";
import { Student } from "../student/student.scemaAndModel";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semestersRegistration/semesterRegistration.modelAndSchema";
import { lookup } from 'dns';
import { Course } from '../course/course.schemaAndModel';

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
   //      const session = await mongoose.startSession();
   //   try{
   //       session.startTransaction();
   //       const result = await EnrolledCourse.create([{
   //              semesterRegistration:isOfferedCourseExist?.semesterRegistration,
   //              academicSemester:isOfferedCourseExist?.academicSemester,
   //              academicDepartment: isOfferedCourseExist?.academicDepartment,
   //              offeredCourse:offeredCourse,
   //              academicFaculty:isOfferedCourseExist?.academicFaculty,
   //              course: isOfferedCourseExist?.course,
   //              student: student_id,
   //              faculty: isOfferedCourseExist?.faculty,
   //       }], {session});

   //       if(!result){
   //          throw new AppError(status.BAD_REQUEST, "Course enrolling is failed!")
   //       };
   //       const maxCapacity = isOfferedCourseExist?.maxCapacity;
   //       await OfferedCourse.findByIdAndUpdate(offeredCourse,
   //          {maxCapacity: maxCapacity -1}
   //       );
   //       await session.commitTransaction();
   //       await session.endSession();
   //       return result;
   //   }catch(err){
   //       await session.abortTransaction();
   //       await session.endSession();
   //       throw new AppError(status.BAD_REQUEST, err);
   //   }

} 

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
}