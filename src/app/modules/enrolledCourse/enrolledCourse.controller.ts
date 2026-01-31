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
});

const updateEnrolledCourseMarks = catchAsync(async(req, res) => {
    const {userId: facultyId}= req.user;
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Updating enrolling course marks is success',
        data: result,
    })
});

const getMyEnrolledCourses = catchAsync(async(req, res , next) => {
    const studentId = req.user.userId;
    const result = await EnrolledCourseServices.getMyEnrolledCourseFromDB(studentId, req.query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Your enrolled courses are retrieved",
        meta: result.meta,
        data: result.result,
    })
})
const getAllEnrolledCourses = catchAsync(async(req, res , next) => {
    const query = req.query;
    const result = await EnrolledCourseServices.getAllEnrolledCourseFromDB(query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All enrolled courses are retrieved",
        meta: result.meta,
        data: result.result,
    })
})
const generateStudentEnrollmentStats = catchAsync(async(req, res , next) => {
   const result = await EnrolledCourseServices.generateStudentEnrollmentStatsIntoDB();

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Generate student enrollment stat is success",
        data: result
    })
})
const getTotalEnrolledCoursePerStudent = catchAsync(async(req, res , next) => {
   const result = await EnrolledCourseServices.getTotalEnrolledCoursePerStudentFromDB();

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All student enrollment stats are retrieved",
       data: result,
    })
})


export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourses,
    getAllEnrolledCourses,
    generateStudentEnrollmentStats,
    getTotalEnrolledCoursePerStudent,
}