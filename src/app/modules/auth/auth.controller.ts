import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";
import AppError from "../../Error/AppError";

const loginUser = catchAsync(async(req, res ) => {
    const result = await AuthService.loginUserIntoDB(req.body);
    const {refreshToken, accessToken, needsPasswordChange} = result;
    
    //set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
    })

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User is loggod in successfuly!",
        data: {
            accessToken,
            needsPasswordChange,
        },
    })
});

const changePassword = catchAsync(async(req, res ) => {
    const result = await AuthService.changePasswordIntoDB(req.user, req.body);
    //console.log(req.user, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password hase been changed successfully',
        data:'use, changed',
    })
})

const refreshToken = catchAsync(async(req, res) => {
    const {refreshToken} = req.cookies;
    const result = await AuthService.refreshTokenIntoDB(refreshToken);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Accessss token is retrieved(by refreshtoken)",
        data: result,
    })
})

const forgetPassword = catchAsync(async(req, res) => {
    const userId = req.body.id;
    const result = await AuthService.forgetPasswordIntoDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Resetlink is generated successfuly",
        data: result,
    })
});

const resetPassword = catchAsync(async(req, res) => {
    const token = req.headers.authorization;
    if(!token){
       throw new AppError(status.UNAUTHORIZED, "Authorization token is required")
    }
    const result = await AuthService.resetPaawordIntoDB(req.body, token)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Password reset successfully!",
        data: result,
    })
})

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}