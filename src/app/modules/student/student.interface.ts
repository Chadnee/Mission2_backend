import { Schema, model, connect, Model, Types } from 'mongoose';


export type TGuardian = {
 fatherName: string;
 fatherOccupation: string;
 fatherContactNo: string;
 motherName: string;
 motherOccupation: string;
 motherContactNo: string;
}

export type TUserName = {
        firstName : string;
        middleName : string;
        lastName : string,
}

export type TLocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string
}
export type TStudent= {
    id: string;
    password: string,
    user : Types.ObjectId,
  name : TUserName;
  gender : "male" | "female";
  dateOfBirth?: string;
  email: string,
  contactNo: string;
  emergencyContactInfo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage? : string;
  // isActive: "active" | "blocked";
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId,
  isDeleted: boolean
}



export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}