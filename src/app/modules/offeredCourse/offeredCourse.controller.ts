import { OfferedCourse } from './offeredCourse.modelAndSchema';
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedOurseService } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async( req, res) => {
    const result = await OfferedOurseService.createOfferedCourseIntoDB(req.body);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: 'The offered course is created successfully',
        data: result
    })
})

const getAllOfferedCourse = catchAsync(async(req, res) => {
    const query  = req.query;
    const result = await OfferedOurseService.getAllOfferedCourseFromDB(query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All offered course are retrieved successfully",
        data: result
    })
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  //console.log('first',userId)
  const result = await OfferedOurseService.getMyOfferedCoursesFromDB(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'OfferedCourses retrieved successfully !',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleOfferedCourse = catchAsync(async(req, res) => {
    const {offeredCourse_Id} = req.params;
    const result = await OfferedOurseService.getSingleOfferedCourseIntoDB(offeredCourse_Id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Targeted offered course are gotted",
        data: result
    })
})

const updateOfferedCourse = catchAsync(async(req, res) => {
    const {offeredCourse_Id} = req.params;
    const result = await OfferedOurseService.updateOfferedCourseIntoDB(offeredCourse_Id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Targeted offer course is updated successfully',
        data: result
    })
})

const deleteOfferedCourse = catchAsync(async(req, res) => {
    const {offeredCourse_Id} = req.params;
    const result =await OfferedOurseService.deleteOfferedCourseFromDB(offeredCourse_Id);

    sendResponse(res, {
        statusCode: status.OK,
        success:true,
        message: 'Targeted offered course has been deleted successfully',
        data: result,
    })
})

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourse,
    getMyOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
}