import { Types } from "mongoose";

export type TAdmin = {
    name: string;
    id: string;
    designation: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    email:string;
    contactNo: string;
    emergencyContactNo: string;
    user: Types.ObjectId,
    presentAddress: string;
    permanentAddress: string;
    profileImage: string;
    managementDepartment: string;
    isDeleted: boolean;
}