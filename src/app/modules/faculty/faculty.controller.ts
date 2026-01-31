import status from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service"

const getAllFaculties = catchAsync(async(req, res , next) => {
    console.log('test', req.user)
    console.log(req.cookies);
    const query = req.query
    const result = await facultyServices.getAllFacultiesFromDB(query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All faculties are retrieved successfuly",
        meta: result.meta,
        data: result.result,
    })
})

const getSingleFaculties = catchAsync(async(req, res , next) => {
    const {faculty_Id} = req.params;
    const result = await facultyServices.getSingleFacultiesFromDB(faculty_Id);

    sendResponse( res, {
        statusCode: status.OK,
        success: true,
        message: "Targeted faculty is gotted",
        data: result
    })
})

const deleteFaculty = catchAsync(async(req, res , next) => {
    const {faculty_Id} = req.params;
    const result = await facultyServices.deleteFacultyFromDB(faculty_Id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Faculty has been succesfully deleted",
        data: result
    })
})

export const facultyControllers = {
    getAllFaculties,
    getSingleFaculties,
    deleteFaculty,
}