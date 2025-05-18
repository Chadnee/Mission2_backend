import { model, Schema } from "mongoose";
import { TAssignCourseWithFaculty, TCourse, TCourseAssignFaculty, TCourseFacultyAssign, TPreRequisiteCourses } from "./course.interface";

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique:true,
        trim: true,
        required:true
    },
    prefix: {
        type: String,
        trim: true,
        required:true
    },
    code: {
        type: Number,
        unique:true,
        trim: true,
        required:true
    },
    credits: {
        type: Number,
        trim: true,
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    preRequisiteCourses: [preRequisiteCourseSchema]
})

export const Course = model<TCourse>('Course', courseSchema)

const courseFacultyAssignSchema = new Schema<TAssignCourseWithFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        unique: true
    },
    faculties:[ {
        type: Schema.Types.ObjectId,
        ref: "faculty"
    }]
})

export const CourseFaculty = model<TAssignCourseWithFaculty>('CourseFacultyAssign', courseFacultyAssignSchema)