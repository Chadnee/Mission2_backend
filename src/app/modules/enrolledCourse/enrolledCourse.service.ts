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
     const student_id = await Student.findOne({id: userId}, {_id:1});
   //   const student_id = student?._id
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
      const enrolledCourse = await EnrolledCourse.aggregate([
         {
            $match: {
               semesterRegistration: isOfferedCourseExist.semesterRegistration,
               Student: student_id,
            },
           
         },
         {
            $lookup: {
               from: 'courses',
               localField:'course',
               foreignField:'_id',
               as: 'enrolledCourseData'
            }
         },
         {
            $unwind: '$enrolledCourseData',
         },
         {
            $group: {
               _id: null,
               totalEnrolledCredits: {$sum:'$enrolledCourseData.credit'}
            }
         },
         {
            $project: {
               _id: 0,
               totalEnrolledCredits: 1
            }
         }
      ])
      console.log(enrolledCourse)

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