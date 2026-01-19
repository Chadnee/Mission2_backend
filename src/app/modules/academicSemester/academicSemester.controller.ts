import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async(req, res, next) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic semester is created successfully",
        data: result,
    })
})

const AllAcademicSemester = catchAsync(async(req, res, next)=> {
    const result = await AcademicSemesterServices.AllAcademicSemesterFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All academic semester are retrieved",
        meta: result.meta,
        data: result.result,
    })
})

const singleAcademicSemester = catchAsync(async(req, res, next)=> {
    const {semester_id} = req.params;
    const result = await AcademicSemesterServices.singleAcademicSemesterFromDB(semester_id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message:"Targeted academic semester is gotted",
        data: result,
    })
})

const updateAcademicSemester = catchAsync(async(req, res, next)=> {
    const {semester_id} = req.params;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semester_id, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Updating academic semester is success",
        data: result
    })
})

export const AcademicSemesterControllers = {
    createAcademicSemester,
    AllAcademicSemester,
    singleAcademicSemester,
    updateAcademicSemester
}