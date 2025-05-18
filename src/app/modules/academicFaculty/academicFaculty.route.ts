import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import express from 'express'
import { AcademicFacultyController } from './academicFaculty.controller';

const router = express.Router();

router.post('/create-academic-faculty',
    //validateRequest(academicFacultyValidation.createAcademicFacultyValidation),
    AcademicFacultyController.createAcademicFaculty);

router.get('/', AcademicFacultyController.getAllAcademicFaculty);
router.get('/:faculty_Id', AcademicFacultyController.getSingleAcademicfaculty)
export const AcademicFacultyRouter = router