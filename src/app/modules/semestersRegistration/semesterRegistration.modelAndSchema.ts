import { model, Schema } from "mongoose";
import { TSmesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

const semesterRegistrationSchema = new Schema<TSmesterRegistration> ({
    academicSemester : {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        unique: true,
    },
    status: {
        type: String,
        enum: SemesterRegistrationStatus,
        default: 'UPCOMING',
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minCredit: {
        type: Number,
        default: 3,
    }, 
    maxCredit: {
        type: Number,
        default: 16
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps:true})

export const SemesterRegistration = model<TSmesterRegistration>('SemesterRegistration', semesterRegistrationSchema);
