import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyService } from "./academicFaculty..service";

const createAcademicFaculty = catchAsync(async(req, res, next)=> {
    const result = await AcademicFacultyService.createAcademicFacultyIntoDB(req.body)
     
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: " Academic faculty is created successfully",
        data: result
    })
});

const getAllAcademicFaculty = catchAsync(async(req, res , next) => {
    const result = await AcademicFacultyService.getAllAcademicFacultyFromDB();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All academic faculty is retrieved",
        data: result
    })
});

const getSingleAcademicfaculty = catchAsync(async(req, res , next)=> {
    const {faculty_Id} = req.params;
    const result = await AcademicFacultyService.getSingleAcademicfacultyFromDB(faculty_Id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true, 
        message: "Targeted academic faculty is gotted",
        data: result,
    })
})

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicfaculty,
}