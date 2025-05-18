import { adminSearcheableFields } from './../admin/admin.constant';
import status from 'http-status';
import AppError from '../../Error/AppError';
import { Faculty } from './faculty.schemaAndModule';
import mongoose from 'mongoose';
import { User } from '../user/user.schemaAndModel';
import QueryBuilder from '../../builder/queryBuilder';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find().populate({
    path: 'academicDepartment',
    populate:{ path:'academicFaculty' },
  }), query)
    .search(adminSearcheableFields)
    .sort()
    .paginate()
    .filter()
    .fields();
  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultiesFromDB = async (id: string) => {
 
  const result = await Faculty.findById({ _id: id}).populate({
    path: 'academicDepartment',
    populate:{ path:'academicFaculty' },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'The faculty id is not existed');
  }
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deleteFaculty = await Faculty.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteFaculty) {
      throw new AppError(status.BAD_REQUEST, 'Faculty deleted is not success');
    }
    const user_id = deleteFaculty.user
    //console.log(deleteFaculty, user_id)

    const deleteUser = await User.findByIdAndUpdate(
      user_id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(status.NOT_FOUND, 'User deletion is failed');
    }

    await session.commitTransaction();
    await session.endSession();
    return deleteFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, err);
  }
};

export const facultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultiesFromDB,
  deleteFacultyFromDB,
};
