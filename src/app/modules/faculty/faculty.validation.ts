import { z } from "zod";

const createFacultyValidation = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        faculty: z.object({
            designation: z.string(),
            name: z.string().min(1).max(20).refine((value)=> /^[A-Z]/.test(value), {
              message: "Name must be start with a capital"}),
            gender: z.enum(['male','female']),
            dateOfBirth: z.string(),
            email:z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            //profile image will be created by req.file with multer and cloudinary
            // profileImage: z.string(),
            academicDepartment: z.string(),
        
        })
    })
})

export const facultiesValidation = {
    createFacultyValidation
}