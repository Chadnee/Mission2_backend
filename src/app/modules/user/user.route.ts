import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultiesValidation } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();


router.post('/create-student', auth(USER_ROLE.admin),
   validateRequest(studentValidations.createStudentValidationSchema), 
   UserControllers.createStudentUser);

router.post('/create-faculty', validateRequest(facultiesValidation.createFacultyValidation), UserControllers.createFacultyUser);

router.post('/create-admin', validateRequest(adminValidation.createAdminValidation), UserControllers.createAdminUser);

export const UserRoutes = router;
