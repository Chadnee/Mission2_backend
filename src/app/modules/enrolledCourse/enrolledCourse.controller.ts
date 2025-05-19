import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async(req, res) => {
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true, 
        message: "Course enrolling is success.",
        data: result
    })
})

export const EnrolledCourseControllers = {
    createEnrolledCourse
}