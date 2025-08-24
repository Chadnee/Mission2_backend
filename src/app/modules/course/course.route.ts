import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { courseValidation } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(courseValidation.createCourseValidation),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);
router.get('/:course_Id', CourseControllers.getSingleCources);
router.delete('/:course_Id', CourseControllers.deleteCources);
router.patch('/:course_Id', validateRequest(courseValidation.updateCourseValidation),
CourseControllers.updateCources)
router.put('/:course_Id/assign-faculties',
  validateRequest(courseValidation.createAssignCourseWithFacultyValidation),
   CourseControllers.createAssignCourseWithFaculty);
router.delete('/:course_Id/remove-faculties', CourseControllers.removeFacultyromCourse)
router.put('/:course_Id/get-faculties',
  auth('admin', 'superAdmin', 'student', 'faculty'),
  CourseControllers.getFacultiesWithCourse 
)
export const CourseRouter = router;
