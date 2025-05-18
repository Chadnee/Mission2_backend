import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeStringSchema =  z.string().refine((time) => timeRegex.test(time),{
    message: "Invalid start time, expected HH:MM in 24 hours format"
} )

const createOfferedCourseValidation = z.object({
   body: z.object({
    semesterRegistration: z.string(),
    // academicSemester: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days:z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: timeStringSchema,
    endTime:timeStringSchema,
   }).refine((body) => {
    const start = new Date(`1970-01-01T${body.startTime}:00`)
    const end = new Date(`1970-01-01T${body.endTime}:00`);

    return end > start
   }, {message: 'Start time should be before End time !'})
})

//university will allow update only for below property
const updateOfferedCourseValidation = z.object({
    body: z.object({
        faculty: z.string(),
        maxCapacity: z.number(),
        days:z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    }).refine((body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`);
    
        return end > start
       }, {message: 'Start time should be before End time !'})
})

export const OfferedCourseValidation = {
    createOfferedCourseValidation,
    updateOfferedCourseValidation
}