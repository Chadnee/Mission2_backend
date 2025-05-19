
import { NextFunction, Request, RequestHandler, Response } from "express";
import studentValidationSchema from "../student/student.validation";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudentUser = catchAsync(async(req, res, next)=>{
    try{
        // console.log(req.file, 'file');
        // console.log(JSON.parse(req.body.data))
       const {password, student:studentData} = req.body;

       //console.log('body',req.body)

       // const zodParserData = studentValidationSchema.parse(studentData)
       const result = await UserServices.createStudentUserIntoDB(
        req.file, password, studentData,
       )
       sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message:"student is created successfully",
        data: result,
       })

    // res.status(200).json({
    //     success: true,
    //     message:"student is created successfully",
    //     data: result,
    // })
    }catch(err)
    {
        next(err)
        //    res.status(500).json({
        //     success: false,
        //     message: err.message
        //    })
    }
})

const createFacultyUser = catchAsync(async(req, res, next) => {
    const {password, faculty: facultyData} = req.body;
    const result = await UserServices.createFacultyUserIntoDB(password, facultyData)

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Faculty is created successfully",
        data: result,
    })
} )

const createAdminUser = catchAsync(async(req, res , next)=> {
    const {password, admin: adminData} = req.body;
    const result = await UserServices.createAdminUserIntoDB(password, adminData)
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin are created succsessfuly",
        data: result
    })
})

const getMe = catchAsync(async(req, res) => {
    const {userId, role} = req.user;
    const result = await UserServices.getMeFromDB(userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User is retrieved successfully!",
        data: result,
    })
})

export const UserControllers = {
    createStudentUser,
    createFacultyUser,
    createAdminUser,
    getMe,
}
// const createUser: RequestHandler = async(req, res, next)=>{
//     try{
//         const {password, student:studentData} = req.body;
//         //console.log(req.body)

//        // const zodParserData = studentValidationSchema.parse(studentData)
//        const result = await UserServices.createUserIntoDB(
//         password, studentData,
//        )
//        sendResponse(res, {
//         statusCode: status.OK,
//         success: true,
//         message:"student is created successfully",
//         data: result,
//        })

//     // res.status(200).json({
//     //     success: true,
//     //     message:"student is created successfully",
//     //     data: result,
//     // })
//     }catch(err)
//     {
//         next(err)
//         //    res.status(500).json({
//         //     success: false,
//         //     message: err.message
//         //    })
//     }
// }

