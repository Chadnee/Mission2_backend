import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post('/create-academic-department', 
    validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidation),
    AcademicDepartmentController.createAcademicDepartment
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartment);
router.get('/:department_id', AcademicDepartmentController.getSingleAcademicDepartment);
router.patch('/:department_id', 
    validateRequest(AcademicDepartmentValidation.updatedAcademicDepartmentValidation),
AcademicDepartmentController.updateAcademicDepartment
)

export const AcademicDepartmentRoute = router;