import { model, Schema } from "mongoose";
import { TOfferedCourse } from "./offeredCourse.interface";
import { Days } from "./offeredCourse.constant";



const offeredCourseSchema = new Schema<TOfferedCourse>({
    semesterRegistration: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'SemesterRegistration'
    },
    academicSemester : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicSemester'
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicSemester'
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'academicDepartment'
    },
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    faculty: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'faculty'
    },
    maxCapacity: {
        type: Number,
        required: true
    },
    section: {
        type: Number,
        required:true
    },
    days: [{
        type: String,
        enum:Days,
    }],
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

export const OfferedCourse = model<TOfferedCourse>("OfferedCourse", offeredCourseSchema)