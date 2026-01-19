import mongoose, { startSession } from "mongoose";
import QueryBuilder from "../../builder/queryBuilder";
import { TAssignCourseWithFaculty, TCourse } from "./course.interface";
import { Course, Course, CourseFaculty } from "./course.schemaAndModel";
import AppError from "../../Error/AppError";
import status from "http-status";

const createCourseIntoDB = async(payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCourcesFromDB = async(query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find()
    .populate('preRequisiteCourses.course'), query)
    .search(['title', 'code', 'prefix'])
    .filter()
    .sort()
    .paginate()
    .fields()
    const result = await courseQuery.modelQuery
    const meta = await courseQuery.countTotal()
    return {result, meta};
};

const getSingleCourseFromDB = async(id: string) => {
    const result = await Course.findById({_id: id}).populate('preRequisiteCourses.course');
   console.log(id, result)
    return result;
};

const updateCourseFromDB = async(id: string, payload: Partial<TCourse>) => {
    const {preRequisiteCourses, ...courseRemainingData} = payload;

    const session = await mongoose.startSession();
    session.startTransaction();
   try{

     
    //update basic-course

    const updateCourseInfo = await Course.findByIdAndUpdate(
        id,
    courseRemainingData,
{
    new: true, runValidators: true, session
})

if(!updateCourseFromDB){
    throw new AppError(status.BAD_REQUEST, "Failed to update basic info")
}

//filter out and remove/delete the 'isDeleted: true' course from prerequisit
if(preRequisiteCourses && preRequisiteCourses.length>0){
    const deletePreRequisite = preRequisiteCourses.filter((element) => element.course && element.isDeleted)
    .map((element)=> element.course);
    console.log(preRequisiteCourses, deletePreRequisite)

    const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id, 
        {$pull: {preRequisiteCourses: {course: {$in: deletePreRequisite}}}},
        {new: true, runValidators: true, session}
    )
    if(!deletedPreRequisiteCourses){
        throw new AppError(status.BAD_REQUEST, "Failed to delete true wala update course")
    }

// filter out and add the new course fields

const newPreRequisites = preRequisiteCourses?.filter(element => element.course && !element.isDeleted)

const newPreRequisiteCourses = await Course.findByIdAndUpdate(
    id,
    {$addToSet: {preRequisiteCourses:{$each: newPreRequisites}}},
    {new: true, runValidators: true, session}
)
if(!newPreRequisiteCourses){
    throw new AppError(status.BAD_REQUEST, "Failed to update fail wala course")
}
}


const result = await Course.findById(id).populate("preRequisiteCourses.course")
 await session.commitTransaction();
 await session.endSession();
return result;

   }catch(err){
    await session.abortTransaction();
    await session.endSession()
     throw new AppError(status.BAD_REQUEST, "Failed to update course");
   }
}
const deleteCourseFromDB = async(id: string) => {//, {isDeleted: true}, {new:true}
   // console.log(id)
    const result = await Course.findByIdAndUpdate(id , {isDeleted: true}, {new:true});
    return result;
}

const assignCourseWithFacultyIntoDB = async(id:string , payload: Partial<TAssignCourseWithFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {course: id, $addToSet: {faculties:{$each:payload}}},
        {upsert: true, new:true}
    ) ;
    return result;
}

const removeFacultyFromCourseFromDB = async(id: string, payload: Partial<TAssignCourseWithFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {$pull:{faculties: {$in:payload }}},
        {
            new:true
        }
    )
    return result;
};
const getFacultiesWithCourseFromDB = async(course_Id: string) => {
  const result = await CourseFaculty.findOne({course: course_Id}).populate('faculty')
  return result;
}


export const CourseServices = {
    createCourseIntoDB,
    getAllCourcesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseFromDB,
    assignCourseWithFacultyIntoDB,
    removeFacultyFromCourseFromDB,
    getFacultiesWithCourseFromDB,
}