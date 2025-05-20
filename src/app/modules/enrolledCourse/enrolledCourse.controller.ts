import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async(req, res) => {
    //find the user
    const userId = req.user.userId;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body);
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