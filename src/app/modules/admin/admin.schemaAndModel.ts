import { model, Schema } from "mongoose";
import { TAdmin } from "./admin.interface";

const adminSchema = new Schema<TAdmin>({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: String,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    user: {
         type: Schema.Types.ObjectId,
         ref:"admin",
         required: true
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
      profileImage: {
        type:String,
        default: ''
    },
    managementDepartment: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const Admin = model<TAdmin>('admin', adminSchema)