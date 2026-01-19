import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidaion } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router()

router.post('/create-semsester-registration', 
    validateRequest(SemesterRegistrationValidaion.createSemesterRegistrationValidation),
SemesterRegistrationController.createSemesterRegistration);

router.get('/', SemesterRegistrationController.getAllSemesterRegistration);
router.get('/:id', SemesterRegistrationController.getSingleSemesterRegistration)
router.patch('/:id', 
    validateRequest(SemesterRegistrationValidaion.updateSemesterRegistrationValidation),
    SemesterRegistrationController.updateSemesterRegistration
)
export const SemesterRegistrationRoute = router;