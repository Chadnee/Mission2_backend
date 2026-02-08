import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidation } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';

const router = express.Router();

// General Route ====> Post , Get and Patch (Update)
//-----------------------------------------------------------------

//Create Enrolled course in your stock if you are a student
router.post('/create-enrollment',auth('student'),
 validateRequest(EnrolledCourseValidation.enrolledCourseValidation),
EnrolledCourseControllers.createEnrolledCourse),

//Get All enrollment of all student, not matter which student exist or not ==>Monitoring for admin  
router.get('/',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.getAllEnrolledCourses)

//Update Course marks after finishing exam ==> Only for faculty
router.patch('/update-course-marks',
    auth('faculty'), validateRequest(EnrolledCourseValidation.updateEnrolledCourseMarksValidationSchema),
    EnrolledCourseControllers.updateEnrolledCourseMarks
),


//Ultra Route for staticticstics in various functional job
//-----------------------------------------------------------------

//Get my enrolled courses all according to my Id if I am a student only
router.get('/my-enrolled-course',
    auth('student'),
EnrolledCourseControllers.getMyEnrolledCourses)

//Create per student own enrolment state
router.post('/student-enrollment-stats/generate',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.generateStudentEnrollmentStats)

//Get per student own enrolment state
router.get('/student-enrollment-stats',
    auth('admin', 'superAdmin'),
EnrolledCourseControllers.getTotalEnrolledCoursePerStudent)

//Get your own enrollement state if you are now existing student user
router.get('/student-enrollment-stats/getMe', 
    auth('student'),
    EnrolledCourseControllers.getTotalEnrolledCourseStateForMe)


export const enrolledCourseRoutes = router