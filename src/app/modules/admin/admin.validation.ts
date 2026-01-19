import { z } from "zod";

const createAdminValidation = z.object({
   body: z.object({
    password: z.string().max(20).optional(),
    admin : z.object({
    name: z.string().min(1).max(20).refine((value)=>/^[A-Z]/.test(value), 
    {message:"Name must be start with capital letter"}),
    gender: z.enum(['male', 'female', 'other']),
    contactNo:z.string(),
    emergencyContactNo:z.string(),
    presentAddress:z.string(),
    permanentAddress: z.string(),
    // profileImage will be created from receiving file by multer and cloudinary
    // profileImage: z.string(),
    managementDepartment: z.string()
    })
   })

})

export const adminValidation = {
    createAdminValidation,
}