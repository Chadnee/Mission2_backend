import QueryBuilder from '../../builder/queryBuilder';
import { academicSemesterNameCodeMapper, AcademicSemesterSearchableFields } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.schemaAndmodel';


const createAcademicSemesterIntoDB = async(payload: TAcademicSemester)=>{
    
  
if(academicSemesterNameCodeMapper[payload.name] !== payload.code){
        throw new Error('Invalid Semester Code')
    }
    const result = AcademicSemesterModel.create(payload);
    return result;
}

const AllAcademicSemesterFromDB = async(query: Record<string, unknown>)=> {
    const academicSemesterQuery = new QueryBuilder(AcademicSemesterModel.find(), query).search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields() 
  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta, result
  }
}

const singleAcademicSemesterFromDB = async(_id: string) => {
    const result = await AcademicSemesterModel.findOne({_id});
    return result;
}

const updateAcademicSemesterIntoDB = async(semester_id:string , payload:Partial<TAcademicSemester>)=> {
    if(payload.name && payload.code &&
        academicSemesterNameCodeMapper[payload.name]!== payload.code
    ) {throw new Error('Invalid Semester Code')};

    const result = await AcademicSemesterModel.findOneAndUpdate({_id: semester_id}, payload, {new: true});

    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    AllAcademicSemesterFromDB,
    singleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB,
}