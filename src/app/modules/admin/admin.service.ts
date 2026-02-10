import mongoose from "mongoose";
import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.schemaAndModel";
import AppError from "../../Error/AppError";
import status from "http-status";
import { User } from "../user/user.schemaAndModel";
import QueryBuilder from "../../builder/queryBuilder";
import { adminSearcheableFields } from "./admin.constant";


const getAllAdminFromDB = async(query:Record<string, unknown>) => {
    const adminQuery =  new QueryBuilder(Admin.find(), query).search(adminSearcheableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await adminQuery.modelQuery;
    return result;
}

const getSingleAdminFromDB = async(id: string) => {
    const result = await Admin.findById({_id: id});
    return result;
}

const deleteAdminAndUserFromDB = async(id: string) => {
   const session = await mongoose.startSession();

   session.startTransaction()

   try{
    const deleteAdmin = await Admin.findByIdAndUpdate({_id: id}, {isDeleted: true}, {new: true, session})
    if(!deleteAdmin){
        throw new AppError(status.BAD_REQUEST, "Faild to delete admin");
    }
    const user_id = deleteAdmin.user;

    
  const deleteUser = await User.findByIdAndUpdate(user_id, {isDeleted: true}, {new:true, session});
  if(!deleteUser){
    throw new AppError(status.BAD_REQUEST, 'Failed to delete admin')
  }
  await session.commitTransaction();
  await session.endSession();

  return deleteAdmin;
   }catch(err: any){
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, err)
;
   }
}

export const AdminService = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    deleteAdminAndUserFromDB,
}