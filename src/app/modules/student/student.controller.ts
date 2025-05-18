import { NextFunction, Request, RequestHandler, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

// import Joi from "joi";
// import studentValidationSchema from "./student.validation";

// const createStudent = async(req: Request, res:Response)=> {
//     try{
//     //   const student = req.body.student;
//     //   const result = await StudentServices.createStudentInoDB(student);
//       const {student: studentData} = req.body;

//       //body er pore validation tarpor result
      
//       //data validation using joi
//     //   const {error, value} = studentValidationSchema.validate(studentData)
//     //   const result = await StudentServices.createStudentInoDB(value);
      
//       const result = await StudentServices.createStudentInoDB(studentData);
   
//     //  console.log({error})
//     //  if(error){
//     //     res.status(500).json({
//     //         success: false,
//     //         message:"omething went wrongg",
//     //         error: error
//     //       })
//     //  }


//        res.status(200).json({
//         success: true,
//         message:"Student is created successfully",
//         data: result
//       })
//     }catch(err: any){
//         res.status(500).json({
//             success: false,
//             message:"Something went wrong",
//             error: err.message
//           })
//     }
// }



const getAllStudents = catchAsync(async (req, res, next) => {
  // console.log(req.query)
    const result = await StudentServices.getAllStudentsFromDB(req.query)
     
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Students are retrieved sucessfully",
      data: result
   
    // res.status(200).json({
    //   success: true,
    //   message: "",
    //   data: result,
    // })
  })
})

const getSingleStudent: RequestHandler = async (req, res, next) => {
    try{
        //router e je name e pathay dici sei name e get krte hobe (studentId)
        const {studentId} = req.params;
       const result = await StudentServices.getSingleStudentFromDB(studentId)
  
          sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Targeted student is gotted",
            data: result
          })
       // res.status(200).json({
    //     success: true,
    //     message: "Targeted student is gotted",
    //     data: result,
    // })
    }catch(err){
       next(err);
    }
};

const updateStudent = catchAsync(async(req, res ,next) => {
  const {studentId} = req.params;
  const result = await StudentServices.updateStudentIntoDB(studentId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Targeted student is updated",
    data: result
  })
})

const deleteStudent = catchAsync(async (req, res, next)=> {
  
    const {studentId} = req.params;
    const result = await StudentServices.deleteStudentFeomDB(studentId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Student has been deleted successfully",
      data: result
    })
    
    // res.status(200).json({
    //   success: true,
    //   message: "Student has been deleted successfully",
    //   data: result
    // })
  // }catch (err){
  //   next(err)
    // res.status(500).json({
    //   success: false,
    //   message: err.message
    // })
  //}
  })
export const StudentControllers = {
    
    getAllStudents,
    getSingleStudent,
    deleteStudent,
    updateStudent,
}