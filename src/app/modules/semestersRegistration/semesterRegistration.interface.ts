import { Types } from "mongoose"

export type TSmesterRegistration = {
    academicSemester: Types.ObjectId;
    status: 'UPCOMING' | 'ONGOING' | 'ENDED';
    startDate: Date;
    endDate: Date;
    minCredit: number;
    maxCredit: number;
    isDeleted: boolean;
}
