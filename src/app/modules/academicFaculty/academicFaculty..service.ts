import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty..schemaAndModel';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  console.log(payload)
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFaculty.find();
  console.log(result)
  return result;
};

const getSingleAcademicfacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findOne({ _id: id });
  return result;
};

export const AcademicFacultyService = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getSingleAcademicfacultyFromDB,
};
