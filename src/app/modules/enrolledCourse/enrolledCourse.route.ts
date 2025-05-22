import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidation } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';

const router = express.Router();

router.post('/create-enrollment',auth('student'),
 validateRequest(EnrolledCourseValidation.enrolledCourseValidation),
EnrolledCourseControllers.createEnrolledCourse),
router.patch('/update-course-marks',
    auth('faculty'), validateRequest(EnrolledCourseValidation.updateEnrolledCourseMarksValidationSchema),
    EnrolledCourseControllers.updateEnrolledCourseMarks
)

export const enrolledCourseRoutes = router