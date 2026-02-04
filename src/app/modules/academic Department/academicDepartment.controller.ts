import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentService } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async(req, res , next) => {
    const result = await AcademicDepartmentService.createAcademicDepartmentIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Academic department is created succesfully",
        data: result
    })
});

const getAllAcademicDepartment = catchAsync(async(req, res) => {
    const result = await AcademicDepartmentService.getAllAcademicDepartmentFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All academic department is retrieved",
        data: result.result,
        meta: result.meta
    })
});

const getSingleAcademicDepartment = catchAsync(async(req, res , next) => {
    const {department_id} = req.params;
    const result = await AcademicDepartmentService.getSingleAcademicDepartmentFromDB(department_id);
    

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Targeted academic department is gotted",
        data: result
    })
});

const updateAcademicDepartment = catchAsync(async(req, res , next) => {
    const {department_id} = req.params;
    const result = await AcademicDepartmentService.updateAcademicDepartmentFromDB(department_id, req.body);
     
    sendResponse(res, {
        statusCode: status.OK,
        success: true, 
        message: "Targeted academic department is updated",
        data: result,
    })
})

export const AcademicDepartmentController = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
}