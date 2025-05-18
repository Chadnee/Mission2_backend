import { updateStudentValidationSchema } from './../student/student.validation';
import { Query } from 'mongoose';
import status from "http-status";
import AppError from "../../Error/AppError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.schemaAndmodel";
import { TSmesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.modelAndSchema";
import QueryBuilder from '../../builder/queryBuilder';
import { registrationSearchableFields } from '../admin/admin.constant';

const createSemesterRegistrationIntoDB = async(payload: TSmesterRegistration)=> {
    const academicSemester = payload.academicSemester;
    
    //check if there any registered semseter that is already UPCOMING OR ONGOING
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne(
      {
        $or: [{ status: 'UPCOMING'}, {status: 'ONGOING'}]
      } 
    );
      if(isThereAnyUpcomingOrOngoingSemester){
        throw new AppError(status.BAD_REQUEST, 
            `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semseter !`)
      }

    const isAcademicSemesterExists = await AcademicSemesterModel.findById(academicSemester);
    if(!isAcademicSemesterExists){
        throw new AppError(status.NOT_FOUND, 'This academic semsester not found')
    }

    const isSemesterRegistrationExists = await SemesterRegistration.findOne({academicSemester: academicSemester});
     if(isSemesterRegistrationExists){
         throw new AppError(
            status.CONFLICT, 'This academic semester is already registered!',
         );
        
    }
    const result = (await SemesterRegistration.create(payload));
    return result;
   
}

const getAllSemesterRegistrationIntoDB = async(query: Record<string, unknown>) => {
    const semseterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query)
   .sort()
    .fields()
    .filter()
    .paginate()
    const result = await semseterRegistrationQuery.modelQuery;
    return result;
}

const getSingleSemesterRegistrationIntoDB = async(id:string) => {
    const result = await SemesterRegistration.findById(id).populate("academicSemester");
    return result;
}

const updateSemesterRegistrationIntoDB = async(id: string, payload: Partial<TSmesterRegistration>) => {
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id)
   
    if(!isSemesterRegistrationExists){
        throw new AppError(status.NOT_FOUND, 'This semsetre is not found')
    }
    //if any requested semester is already ended

    const currentSemesterStatus = isSemesterRegistrationExists?.status;
    if(currentSemesterStatus === 'ENDED'){
      throw new AppError(status.BAD_REQUEST, 
        `This semseter is already ${currentSemesterStatus}`,
      )
    } 
    const requestedSemesterStatus = payload.status
 console.log({currentSemesterStatus, requestedSemesterStatus})
    //UPCOMING --> ONGOING --> ENDED
    if(currentSemesterStatus === 'UPCOMING' && requestedSemesterStatus==='ENDED'){
        throw new AppError( status.BAD_REQUEST, 
            `You can not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`
        )
    }

    //if admin try to update data fron ongoing to upcoming
     if(currentSemesterStatus === "ONGOING" && requestedSemesterStatus=== "UPCOMING"){
        throw new AppError(status.BAD_REQUEST, `Yoou can not directly change from ${currentSemesterStatus} to ${requestedSemesterStatus}`)
     }

     const result = await SemesterRegistration.findById(
        id, 
        payload,
        {new: true, runValidators: true}
    )

    return result;

} 
export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationIntoDB,
    getSingleSemesterRegistrationIntoDB,
    updateSemesterRegistrationIntoDB
}