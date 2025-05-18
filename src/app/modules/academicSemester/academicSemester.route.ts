import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemesterValidation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.post('/create-academic-semester', validateRequest
    (AcademicSemesterValidations.createAcademicSemesterValidation), 
    AcademicSemesterControllers.createAcademicSemester
);

router.get('/', AcademicSemesterControllers.AllAcademicSemester)

router.get('/:semester_id', AcademicSemesterControllers.singleAcademicSemester)

router.patch('/:semester_id', AcademicSemesterControllers.updateAcademicSemester)
export const AcademicSemesterRoute = router;