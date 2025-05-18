import { Types } from "mongoose";

export type TFaculty = {
    id: string;
    designation: string;
    name: string;
    user: Types.ObjectId;
    gender: 'male' | 'female';
    dateOfBirth: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string ;
    profileImage: string;
    academicDepartment: Types.ObjectId;
    isDeleted: boolean;
}