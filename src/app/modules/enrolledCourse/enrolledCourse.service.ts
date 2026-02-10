import { enrolledCourseSearchableFields, grade } from './enrolledCourse.const';
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
import QueryBuilder from '../../builder/queryBuilder';
import { StudentEnrollmentStats } from './studentEnrollmentsStatsSchema';

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
     }catch(err:any){
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
const getAllEnrolledCourseFromDB = async (query: Record<string, unknown>) => {
   const enrolledCourse = new QueryBuilder(EnrolledCourse.find()
  .populate('offeredCourse')
    .populate('course')
    .populate('faculty')

    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment'), query)
    .search(enrolledCourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourse.modelQuery;
  const meta = await enrolledCourse.countTotal();

  return {
    meta,
    result
  }}


const getMyEnrolledCourseFromDB = async(studentId: string, query: Record<string, unknown>) => {
   const student = await Student.findOne({id: studentId});
  //console.log(student, studentId)
   if(!student){
      throw new AppError(status.NOT_FOUND, 'Student not found')
   }
   
   const enrolledCourseQuery = new QueryBuilder(EnrolledCourse.find({student: student._id})
.populate('offeredCourse')
    .populate('course')
    .populate('faculty')
    .populate('student')
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment'),  query)
   .sort()
    .fields()
    .filter()
    .paginate()
    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal()
    return{ meta,result};
}


const generateStudentEnrollmentStatsIntoDB = async () => {
  const aggregationResult = await Student.aggregate([
    {
      $lookup: {
        from: "enrolledcourses",
        localField: "_id",
        foreignField: "student",
        pipeline: [
          {
            $match: {
              isEnrolled: true,
              isCompleted: false,
            },
          },
        ],
        as: "enrollments", //2027010003-hadi //Sarika	2027020002
      },
    },
    {
      $addFields: {
        totalEnrolledCourses: { $size: "$enrollments" },
      },
    },
    {
      $match: {
        totalEnrolledCourses: { $gt: 0 }, // ✅ only enrolled students
      },
    },
    
  {
  $project: {
    _id: 1,
    id: 1,
    name: 1,
    email: 1,
    gender:1,
    academicDepartment: 1,
    totalEnrolledCourses: 1,
  },
}

  ]);

  for (const student of aggregationResult) {
    await StudentEnrollmentStats.findOneAndUpdate(
      { student: student._id },
      {
        student: student._id,
        studentId: student.id, // ✅ now exists
        name: student.name,
        email: student.email,
        gender: student.gender,
        academicDepartment: student.academicDepartment,
        totalEnrolledCourses: student.totalEnrolledCourses,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  // returning count is OK for admin operation logs
  return aggregationResult.length;
};

const getTotalEnrolledCoursePerStudentFromDB = async () => {
  return StudentEnrollmentStats.find()
  .populate("academicDepartment", "name academicFaculty")
  .sort({ totalEnrolledCourses: -1 })
    .select("-__v");
};

const getTotalEnrolledCourseStateForMeFromDB = async (studentId : string) => {
    const result = await StudentEnrollmentStats.findOne({studentId: studentId});
    return result
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getAllEnrolledCourseFromDB,
    updateEnrolledCourseMarksIntoDB,
    getMyEnrolledCourseFromDB,
    generateStudentEnrollmentStatsIntoDB,
    getTotalEnrolledCoursePerStudentFromDB,
    getTotalEnrolledCourseStateForMeFromDB
}