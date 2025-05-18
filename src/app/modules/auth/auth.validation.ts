import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        id: z.string({required_error: "Id is required"}),
        password:z.string({required_error: "Password is required"})
    })
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error:'Old password is required',
        }),
        newPassword: z.string({
            required_error:'Password is required'
        })
    })
});

const refresshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required'
        })
    })
});

const forgetPasswordValidation = z.object({
    body: z.object({
        id: z.string({
            required_error: "User id is required!"
        })
    })
});

const resetPasswordValidation = z.object({
    body:z.object({
        id: z.string({required_error: "User is is required!"}),
        newPassword: z.string({required_error: "New password is required!"})
    })
})

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refresshTokenValidationSchema,
    forgetPasswordValidation,
    resetPasswordValidation,
}