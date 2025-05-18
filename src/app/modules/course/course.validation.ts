import { z } from "zod";

const preRequisiteCourseSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
})

const createCourseValidation = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        preRequisiteCourses: z.array(preRequisiteCourseSchema).optional(),
        isDeleted: z.boolean().optional()
    })
})
const updateCourseValidation = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        preRequisiteCourses: z.array(preRequisiteCourseSchema).optional(),
        isDeleted: z.boolean().optional()
    })
})

const createAssignCourseWithFacultyValidation = z.object({
   body: z.object({
    faculties: z.array(z.string())
   })
})


export const courseValidation = {
    createCourseValidation,
    updateCourseValidation,
    createAssignCourseWithFacultyValidation
}
