import { z } from "zod";

const enrolledCourseValidation = z.object({
   body: z.object({
    offeredCourse: z.string(),
   })
});
const updateEnrolledCourseMarksValidationSchema = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        offeredCourse: z.string(),
        student:z.string(),  //revceiving these 3 property for checkig validation along existency of same property of an data
        courseMarks: z.object({
            classTest1: z.number().optional(),
            midTerm: z.number().optional(),
            classTest2:z.number().optional(),
            finalTerm: z.number().optional(),
        })
    })
})

export const EnrolledCourseValidation = {
    enrolledCourseValidation,
    updateEnrolledCourseMarksValidationSchema
}