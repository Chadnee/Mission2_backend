import { model, Schema } from "mongoose";
import { TStudentEnrollmentStats } from "./enrolledCourse.interface";
import { nameSchema } from "../student/student.scemaAndModel";
import { AcademicDepartment } from "../academic Department/academicDepartment.schemaAndModel";

const studentEnrollmentStateSchema = new Schema<TStudentEnrollmentStats>({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true
    },
    name: {
        type: nameSchema,
    },
    studentId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    totalEnrolledCourses: {
        type: Number,
        required: true,
        default: 0
    },
    academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'academicDepartment', //jeta export koreci seta noy, ()er vitorer model name dite hobe
            // ete mongoose name dhore model khuje nibe, but eta best practise or best dveloper er kaj noy
            required:true
        },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

studentEnrollmentStateSchema.index({student: 1});
export const StudentEnrollmentStats = model<TStudentEnrollmentStats>(
    "StudentEnrollmentStats", studentEnrollmentStateSchema
)