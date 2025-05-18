import { TAcademicFaculty } from './academicFaculty.interface';
import { model, Schema } from "mongoose";

const academicFacultySchema = new Schema <TAcademicFaculty>({
    name: {
        type: String,
        required: true, 
        unique: true
    }

}, {timestamps: true})

export const AcademicFaculty = model<TAcademicFaculty>('AcademicFaculty', academicFacultySchema)