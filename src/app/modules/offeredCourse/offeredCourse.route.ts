import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidation } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-offered-course', 
    validateRequest(OfferedCourseValidation.createOfferedCourseValidation),
    OfferedCourseControllers.createOfferedCourse
);

router.get('/', OfferedCourseControllers.getAllOfferedCourse);
router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
);
router.get('/:offeredCourse_Id', OfferedCourseControllers.getSingleOfferedCourse);
router.patch('/:offeredCourse_Id',
    validateRequest(OfferedCourseValidation.updateOfferedCourseValidation),
    OfferedCourseControllers.updateOfferedCourse
)
router.delete('/:offeredCourse_Id', OfferedCourseControllers.deleteOfferedCourse)

export const OfferedCourseRoute = router;