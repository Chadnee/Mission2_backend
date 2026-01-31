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
),
router.get('/my-enrolled-course',
    auth('student'),
EnrolledCourseControllers.getMyEnrolledCourses)
router.get('/',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.getAllEnrolledCourses)
router.post('/student-enrollment-stats/generate',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.generateStudentEnrollmentStats)
router.get('/student-enrollment-stats',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.getTotalEnrolledCoursePerStudent)

export const enrolledCourseRoutes = router