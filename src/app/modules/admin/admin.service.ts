import mongoose from "mongoose";
import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.schemaAndModel";
import AppError from "../../Error/AppError";
import status from "http-status";
import { User } from "../user/user.schemaAndModel";
import QueryBuilder from "../../builder/queryBuilder";
import { adminSearcheableFields } from "./admin.constant";


const getAllAdminFromDB = async(query:Record<string, unknown>) => {
    console.log("🔥 FUNCTION CALLED");
    const adminQuery =  new QueryBuilder(Admin.find().populate('user'), query).search(adminSearcheableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    
    const meta = await adminQuery.countTotal();
    const result = await adminQuery.modelQuery;
    
       // ✅ DEBUG HERE
    console.log("META BACKEND =>", meta);
    console.log("RESULT BACKEND =>", result);

    // console.log(adminQuery)
    // // console.log(result)
    return {
        meta,
        result
    };
}

const getSingleAdminFromDB = async(id: string) => {
    const result = await Admin.findById({_id: id}).populate('user');
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