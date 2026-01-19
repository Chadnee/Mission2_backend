import { Types } from "mongoose";

export type TFaculty = {
    id: string;
    designation: string;
    name: string;
    user: Types.ObjectId;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    email: {
    type: String,
    required: true,
    unique: true,
}
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string ;
    profileImage: string;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    isDeleted: boolean;
}