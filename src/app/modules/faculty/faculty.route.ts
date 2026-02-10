import express from 'express';
import { facultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router()

router.get('/', 
    // auth(USER_ROLE.admin), 
    facultyControllers.getAllFaculties);
router.get('/:faculty_Id', facultyControllers.getSingleFaculties);
router.delete('/:faculty_Id', facultyControllers.deleteFaculty);

export const FacultyRouter = router;