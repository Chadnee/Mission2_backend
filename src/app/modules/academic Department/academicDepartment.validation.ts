import { z } from "zod";

const createAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({invalid_type_error: "Academic department must be  astring", required_error: " Academic department must be required" }),
        academicFaculty: z.string({invalid_type_error: "academicFaculty must be a string", required_error: "academicFaculty must be required" })
    }),
})

const updatedAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({invalid_type_error: "Academic department must be  astring", required_error: " Academic department must be required" }).optional(),
        academicFaculty: z.string({invalid_type_error: "academicFaculty must be a string", required_error: "  academicFaculty must be required" }).optional()
    })
})

export const AcademicDepartmentValidation = {
    createAcademicDepartmentValidation,
    updatedAcademicDepartmentValidation,
}