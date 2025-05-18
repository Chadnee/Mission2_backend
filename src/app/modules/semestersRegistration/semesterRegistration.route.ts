import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidaion } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router()

router.post('/create-semsester-registration', 
    validateRequest(SemesterRegistrationValidaion.createSemesterRegistrationValidation),
SemesterRegistrationController.createSemesterRegistration);

router.get('/', SemesterRegistrationController.getAllSemesterRegistration);
router.get('/:registration_Id', SemesterRegistrationController.getSingleSemesterRegistration)
router.patch('/:registration_Id', 
    validateRequest(SemesterRegistrationValidaion.updateSemesterRegistrationValidation),
    SemesterRegistrationController.updateSemesterRegistration
)
export const SemesterRegistrationRoute = router;