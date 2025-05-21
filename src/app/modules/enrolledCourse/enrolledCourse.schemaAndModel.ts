import { model, Schema } from 'mongoose';
import {
  TCourseMarks,
  TEnrolledCourse,
  TGrade,
} from './enrolledCourse.interface';
import { grade } from './enrolledCourse.const';
const courseMarksSchema = new Schema<TCourseMarks>({
  classTest1: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
   midTerm1: {
    type: Number,
    min:0,
    max:30,
    default: 0,
  },
  classTest2: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  finalTerm: {
    type: Number,
    default: 0,
  },
});

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    ref: 'SemesterRegistration',
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
    require: true,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'academicDepartment',
    require: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
    require: true,
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    ref: 'OfferedCourse',
    require: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    require: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    require: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'faculty',
    require: true,
  },
  isEnrolled: {
    type: Boolean,
    default: true,
  },
  courseMarks: {
    type: courseMarksSchema,
    default: {},
  },
  garade: {
    type: String,
    enum: grade,
    default: 'NA',
  },
  gradePoints: {
    type: Number,
    max: 4,
    min: 0,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
);
