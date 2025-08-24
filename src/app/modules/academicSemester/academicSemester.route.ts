import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemesterValidation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-academic-semester', validateRequest
    (AcademicSemesterValidations.createAcademicSemesterValidation), 
    AcademicSemesterControllers.createAcademicSemester
);

router.get('/', auth('admin','superAdmin'), AcademicSemesterControllers.AllAcademicSemester)

router.get('/:semester_id', AcademicSemesterControllers.singleAcademicSemester)

router.patch('/:semester_id', auth('admin','superAdmin'),
 AcademicSemesterControllers.updateAcademicSemester)
export const AcademicSemesterRoute = router;