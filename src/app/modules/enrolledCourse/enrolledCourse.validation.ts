import { z } from "zod";

const enrolledCourseValidation = z.object({
   body: z.object({
    offeredCourse: z.string(),
   })
})

export const EnrolledCourseValidation = {
    enrolledCourseValidation,
}