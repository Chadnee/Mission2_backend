import mongoose from 'mongoose';
import { TGuardian, TStudent } from './student.interface';
import { Student } from './student.scemaAndModel';
import AppError from '../../Error/AppError';
import status from 'http-status';
import { User } from '../user/user.schemaAndModel';
import QueryBuilder from '../../builder/queryBuilder';
import { studentSearcheableFields } from './student.constant';

// const createStudentInoDB = async(studentData: TStudent) => {
//     console.log('student data check :', studentData)
//      // static method
//      //const existingUser = await Student.isUserExists(studentData.id);
//     // console.log("Existing user check:", existingUser);
//      if (await Student.isUserExists(studentData.id)){
//         throw new Error('User already exists!');
//     }
//     const result = await Student.create(studentData);

//     return result;
// }

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //admissionSemester: Types.ObjectId; academicDepartment
  const studentQuery = new QueryBuilder(Student.find()
     .populate('admissionSemester')
    .populate({
      path:'academicDepartment',
      populate: { path:'academicFaculty' }}), query)
    .search(studentSearcheableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
  // const result = await searchQuery.find(queryObj)

  // // const result = await Student.find({
  // //   $or: studentSearcheableFields.map((field)=> ({
  // //     [field]: {$regex: searchTerm, $options: 'i'},
  // //   })
  // //     )
  // // })
  //   .populate('admissionSemester')
  //   .populate({
  //     path:'academicDepartment',
  //     populate: { path:'AcademicFaculty' },
  //   });
  // return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'AcademicFaculty' },
    });
  return result;
};

const deleteStudentFeomDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, 'Failed to delete student and user');
  }
};

const updateStudentIntoDB = async (id: String, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  //console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};
export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFeomDB,
  updateStudentIntoDB,
};

// kivabe raw akare search, filter, sorting, pagination, limit, fields korte hoy (chain method):

// const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
//   //admissionSemester: Types.ObjectId; academicDepartment

//   const queryObj = {...query}

//   const studentSearcheableFields =['email', 'name.firstName', 'presentAddress', 'page']
//   let searchTerm = '';

//   if (query?.searchTerm){
//     searchTerm = query?.searchTerm as string;
//   };

//   const searchQuery = Student.find({
//     $or: studentSearcheableFields.map((field)=> ({
//       [field]: {$regex: searchTerm, $options: 'i'},
//     })
//       )
//   })

//   //filtering
//   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

//   excludeFields.forEach((el) => delete queryObj[el])
//   console.log("base query:", {query}, {queryObj})

//   const filterQuery =  searchQuery.find(queryObj)
//   // const result = await Student.find({
//   //   $or: studentSearcheableFields.map((field)=> ({
//   //     [field]: {$regex: searchTerm, $options: 'i'},
//   //   })
//   //     )
//   // })
//     .populate('admissionSemester')
//     .populate({
//       path:'academicDepartment',
//       populate: { path:'academicFaculty' },
//     });

//     let sort = '-createdAt';
//     if(query.sort) {
//       sort = query.sort as string;
//     }

//     const sortQuery = filterQuery.sort(sort);

//     let page = 1
//     let limit = 1;
//     let skip = 1

//     if(query.limit){
//       limit = Number(query.limit);
//     }

//     if(query.page){
//       page = Number(query.page);
//       skip = (page-1) * limit
//     }
//     const paginationQuery = sortQuery.skip(skip)

//     const limitQuery = paginationQuery.limit(limit);

//     let fields = '-__v';

//     if(query.fields){
//       fields = (query.fields as string).split(',').join(' ');
//       console.log({fields});
//     }

//     const fieldQuery = limitQuery.select(fields);

//     return fieldQuery;
//   // const result = await searchQuery.find(queryObj)

//   // // const result = await Student.find({
//   // //   $or: studentSearcheableFields.map((field)=> ({
//   // //     [field]: {$regex: searchTerm, $options: 'i'},
//   // //   })
//   // //     )
//   // // })
//   //   .populate('admissionSemester')
//   //   .populate({
//   //     path:'academicDepartment',
//   //     populate: { path:'AcademicFaculty' },
//   //   });
//   // return result;
// };
