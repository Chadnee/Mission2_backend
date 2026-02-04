import { status } from 'http-status';
import { AcademicDepartmentService } from './academicDepartment.service';
import { TAcademicDepartment } from './academicDepartment.interface';
import { model, Schema } from 'mongoose';
import AppError from '../../Error/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      // ref: AcademicFaculty
      ref:'AcademicFaculty',
    },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function () {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new AppError(status.CONFLICT, 'The department already exists');
  }
});

academicDepartmentSchema.pre('findOneAndUpdate', async function () {
  const query = this.getQuery();

  const isDepartmentExistById = await this.model.findOne(query);

  if (!isDepartmentExistById) {
    throw new AppError(status.NOT_FOUND, 'This department does not exist');
  }
});

// //when I try to insert same named department, the error will be
// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExist) {
//     throw new AppError(status.NOT_FOUND, 'The department already existed');
//     // throw new AppError(404, "The department already existed")
//   }
//   next();
// });

// // when I try to update any department which is not existed by _id, the error throw will be:
// academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
//   const query = this.getQuery; //_id
//   // console.log(query)
//   const isDepartmentExistById = await AcademicDepartment.findOne(query);

//   if (!isDepartmentExistById) {
//     throw new AppError(status.NOT_FOUND, 'this department does not existed');
//   }
//   next();
// });

export const AcademicDepartment = model<TAcademicDepartment>(
  'academicDepartment',
  academicDepartmentSchema,
);
