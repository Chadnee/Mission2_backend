import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/login', 
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser);
router.post('/change-password',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword
);
router.post('/refreshToken',
    validateRequest(AuthValidation.refresshTokenValidationSchema),
    AuthControllers.refreshToken
);
router.post('/forget-password',
    validateRequest(AuthValidation.forgetPasswordValidation),
    AuthControllers.forgetPassword
);
router.post('/reset-password', 
    validateRequest(AuthValidation.resetPasswordValidation),
    AuthControllers.resetPassword
)

export const AuthRoute = router