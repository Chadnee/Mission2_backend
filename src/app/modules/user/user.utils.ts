import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { Faculty } from "../faculty/faculty.schemaAndModule";
import { User } from "./user.schemaAndModel";

// const findLastStudentId = async() => {
//      const lastStudent = await User.findOne(
//     {
//       role: 'student',
//     },
//     {
//       id: 1,
//       _id: 0,
//     },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastStudent?.id ? lastStudent.id : undefined;
// };
const findLastStudentId = async (year: string, code: string) => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
      id: { $regex: `^${year}${code}` }, // VERY IMPORTANT
    },
    { id: 1, _id: 0 },
  )
    .sort({ id: -1 }) // 🔥 NOT createdAt
    .lean();

  return lastStudent?.id;
};
export const generatedStudentId = async (payload: TAcademicSemester) => {
  const lastStudentId = await findLastStudentId(
    payload.year,
    payload.code,
  );

  let currentId = '0000';

  if (lastStudentId) {
    currentId = lastStudentId.substring(6);
  }

  const incrementId = (Number(currentId) + 1)
    .toString()
    .padStart(4, '0');

  return `${payload.year}${payload.code}${incrementId}`;
};


// export const generatedStudentId = async (payload: TAcademicSemester) => {
//   console.log(payload)
//   let currentId = (0).toString();
//   const lastStudentId = await findLastStudentId();

//   const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
//   const lastStudentYear = lastStudentId?.substring(0, 4);

//   const currentSemesterCode = payload.code;
//   const currentYear = payload.year;

//   if (
//     lastStudentId &&
//     lastStudentSemesterCode === currentSemesterCode &&
//     lastStudentYear === currentYear
//   ) {
//     currentId = lastStudentId.substring(6);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   incrementId = `${payload.year}${payload.code}${incrementId}`;

//   return incrementId;
// };

//generate faculties id

const findlastFacultiesId = async()=> {
    const lastFaculty = await User.findOne({role: 'faculty'}, {id:1, _id:0})
    .sort({createdAt: -1}).lean()
    return lastFaculty?.id? lastFaculty.id: undefined
}

export const generatedFacaultiesId = async() => {
    let currentId = (0).toString();
   // console.log("facuty id: ", await findlastFacultiesId());

    const lastFacultyId = await findlastFacultiesId();
    if(lastFacultyId){
        // currentId = lastFacultyId.substring(6)
        currentId = lastFacultyId.split('-')[1];
    }
    let incrementId = (Number(currentId)+1).toString().padStart(4, '0');
     incrementId = `F-${incrementId}`
   //console.log(incrementId, lastFacultyId)
     return incrementId;

}

const findLastAdminId = async() => {
    const lastAdmin = await User.findOne({role: 'admin'}, {id:1, _id:0})
    .sort({createdAt: -1}).lean();
    return lastAdmin?.id? lastAdmin.id: undefined;
}

export const generatedAdminId = async() => {
    let currentId = (0).toString();
    const lasAdminId = await findLastAdminId();
    if(lasAdminId){
        currentId = lasAdminId.split('-')[1];
    }
    let incrementId = (Number(currentId) +1).toString().padStart(4, '0');
    incrementId = `A-${incrementId}`;
    //console.log(incrementId)

    return incrementId;
}

