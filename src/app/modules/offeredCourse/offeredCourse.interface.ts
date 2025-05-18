import { Types } from "mongoose"


export type TDays =  'SAT' | 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' ;

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId,
  academicSemester: Types.ObjectId,
  academicDepartment: Types.ObjectId,
  academicFaculty: Types.ObjectId,
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number,
  days: TDays[] ,
  startTime: string;
  endTime: string;
  isDeleted:boolean;
 
}

export type TSchedule = {
  days: TDays[];
  startTime: string,
  endTime: string;
}