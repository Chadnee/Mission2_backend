import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service"
import catchAsync from "../../utils/catchAsync";

const createCourse = catchAsync(async(req, res , next) => {
    const result = await CourseServices.createCourseIntoDB(req.body);

    sendResponse( res, {
        statusCode: status.OK,
        success: true,
        message: "Course is created Succesfully",
        data: result
    })
});

const getAllCourses = catchAsync(async(req, res ,next) => {
    const result = await CourseServices.getAllCourcesFromDB(req.query);
    
    sendResponse(res , {
        statusCode: status.OK,
        success: true, 
        message: "All courses are retrieved successfully",
        data: result
    })
})

const getSingleCources = catchAsync(async(req, res , next) => {
    const {course_Id} = req.params;
    const result = await CourseServices.getSingleCourseFromDB(course_Id);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true ,
        message: "Targeted course is retrieved",
        data: result
    })
});

const deleteCources = catchAsync(async(req, res , next) => {
    const {course_Id} = req.params;
  //  console.log('id:', {course_Id})
const result = await CourseServices.deleteCourseFromDB(course_Id);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Targeted course is deleted successfully",
        data: result
    })
})
const updateCources = catchAsync(async(req, res , next) => {
    const {course_Id} = req.params;
   // console.log('id:', {course_Id})
const result = await CourseServices.updateCourseFromDB(course_Id, req.body);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Targeted course is updated successfully",
        data: result
    })
})

const createAssignCourseWithFaculty = catchAsync(async(req, res , next) => {
    const {course_Id} = req.params;
    const {faculties} = req.body;

    const result = await CourseServices.assignCourseWithFacultyIntoDB(course_Id, faculties);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Course is assigned successfully",
        data: result,
    })
})

const removeFacultyromCourse = catchAsync(async( req, res , next)=> {
  const {course_Id} = req.params;
  const {faculties} = req.body;

  const result = await CourseServices.removeFacultyFromCourseFromDB(course_Id, faculties);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Targeted faculty is successfully deleted from course",
    data: result
  })
})
const getFacultiesWithCourse = catchAsync(async(req, res) => {
    const {course_Id} = req.params;
    const result = await CourseServices.getFacultiesWithCourseFromDB(course_Id);
    sendResponse(res, {
        statusCode: status.OK,
        success:true,
        message: "All faculties with this course are retrieved!",
        data: result
    })
})
export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCources,
    deleteCources,
    updateCources,
    createAssignCourseWithFaculty,
    removeFacultyromCourse,
    getFacultiesWithCourse,

}