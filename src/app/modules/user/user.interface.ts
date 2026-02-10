// export type TUser = {
//     id: string;
//     password: string;
//     needsPasswordChange: boolean;
//     role: 'admin' | 'student' | 'faculty';
//     status: 'in-progress'| 'blocked';
//     isDeleted: boolean;

import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

// }
export interface TUser {
  id: string;
  email:string;
  password: string;
  needsPasswordChange: boolean;
  passWordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}
export interface TVisitorState {
  ip: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<TUser> {
  //  myStaticMethod(): number;
  isUserExistsByCustomeId(id: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  
  isJWTIssuedBeforePasswordChanged(
    passWordChangedTimestamp : Date,
    jwtIssuedTimestamps: number,
  ): boolean;
}


export type TUserRole = keyof typeof USER_ROLE;
