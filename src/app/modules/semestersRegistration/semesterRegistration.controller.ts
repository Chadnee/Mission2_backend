import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistration } from "./semesterRegistration.modelAndSchema";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async(req, res , next) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Semester registration is successfully placed",
        data: result,
    })
})

const getAllSemesterRegistration = catchAsync(async(req, res , next) => {
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationIntoDB(req.query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All registered semester are retrieved",
        data: result,
    })
})

const getSingleSemesterRegistration = catchAsync(async(req, res) => {
    const {registration_Id} = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationIntoDB(registration_Id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Targeted registered semester is gotted",
        data: result
    })
});

const updateSemesterRegistration = catchAsync(async(req, res) => {
  const {registration_Id} = req.params;
  const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(registration_Id, req.body)

  sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Updated successfully",
        data: result
  })
})

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
}