import QueryBuilder from "../../builder/queryBuilder";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.schemaAndModel"

const createAcademicDepartmentIntoDB = async(payload: TAcademicDepartment) => {
   
    // const isDepartmentExist = await AcademicDepartment.findOne({name: payload.name})

    // if(isDepartmentExist){
    //     throw new Error('This department is already exist!')
    // }
    // r o shortcut kore:
    //  if(await AcademicDepartment.findOne({name: payload.name})){
        
    //         throw new Error('This department is already exist!')
        
    // }
    const result = await AcademicDepartment.create(payload);
    return result;
}

const getAllAcademicDepartmentFromDB = async(query: Record<string, unknown>) => {
    const departmentQuery = new QueryBuilder(AcademicDepartment.find().populate('academicFaculty'), query)
    .fields()
    .filter()
    .paginate()
    .sort()
    
   const result = await departmentQuery.modelQuery;
  const meta = await departmentQuery.countTotal();

  return {
    meta,
    result
  };
}
const getSingleAcademicDepartmentFromDB = async(id : string) => {
    const result = await AcademicDepartment.findOne({_id: id}).populate('academicFaculty');;
    return result;
}

const updateAcademicDepartmentFromDB = async( id: string, payload: Partial<TAcademicDepartment>)=> {
    const result = await AcademicDepartment.findOneAndUpdate({_id:id}, payload, {new: true});
    return result;

};

export const AcademicDepartmentService = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentFromDB,
}