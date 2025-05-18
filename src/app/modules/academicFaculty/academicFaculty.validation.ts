import { z } from "zod";

const createAcademicFacultyValidation = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Academic faculty must be string'
        })
    })
});

const updateAcademicFacultyValidation = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Academic faculty must be string'
        }).optional()
    })
})

export const academicFacultyValidation = {
    createAcademicFacultyValidation,
    updateAcademicFacultyValidation,
}