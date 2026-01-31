import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultiesValidation } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { User } from './user.schemaAndModel';

const router = express.Router();


router.post('/create-student', auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'),
  (req:Request, res:Response, next: NextFunction) => {
   req.body = JSON.parse(req.body.data);
   next()
  },
   validateRequest(studentValidations.createStudentValidationSchema), 
   UserControllers.createStudentUser);

router.post('/create-faculty', auth(USER_ROLE.admin, USER_ROLE.superAdmin),
upload.single('file'),(req:Request, res:Response, next:NextFunction) =>{
  req.body = JSON.parse(req.body.data);
  next()
},
validateRequest(facultiesValidation.createFacultyValidation), UserControllers.createFacultyUser);

router.post('/create-admin', 
    // auth(USER_ROLE.superAdmin),
upload.single('file'),
(req: Request, res: Response, next:NextFunction) => {
  req.body = JSON.parse(req.body.data);
  next()
},
validateRequest(adminValidation.createAdminValidation), UserControllers.createAdminUser);

router.get('/', auth('admin', 'superAdmin'),UserControllers.getAllUser);
router.get('/total-users', auth('admin', 'superAdmin'),UserControllers.getUsersCountForAdminDashBoard);

router.get('/me', auth('admin','faculty','student'), UserControllers.getMe)

router.get('/visitors', auth("admin", "superAdmin"), UserControllers.getVisitorsStates)
export const UserRoutes = router;
