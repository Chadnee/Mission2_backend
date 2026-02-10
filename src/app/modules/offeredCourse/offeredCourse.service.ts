import { status } from 'http-status';
import QueryBuilder from '../../builder/queryBuilder';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.modelAndSchema';
import { SemesterRegistration } from '../semestersRegistration/semesterRegistration.modelAndSchema';
import AppError from '../../Error/AppError';
import { AcademicDepartment } from '../academic Department/academicDepartment.schemaAndModel';
import { AcademicFaculty} from '../academicFaculty/academicFaculty..schemaAndModel';
import { Course } from '../course/course.schemaAndModel';
import { Faculty } from '../faculty/faculty.schemaAndModule';
import { hasTimeConflict } from './offeredCourse.utils';
import mongoose from 'mongoose';
import { Student } from '../student/student.scemaAndModel';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    section,
    course,
    faculty,
    days,
    startTime,
    endTime
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(status.NOT_FOUND, 'Semester registration not found');
  }

  const academicSemester = isSemesterRegistrationExists?.academicSemester;

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(status.NOT_FOUND, 'Academic department not found');
  }
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Academic faculty not found');
  }
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Course not found');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Faculty not found');
  }

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  });
 // console.log(isDepartmentBelongToFaculty);
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      status.NOT_FOUND,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
    );
  }

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
  await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  })

  if(isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(status.BAD_REQUEST, 'Offerec course with same section is already exists!')
  }


  //check if anyoune try to make class at the same time, ans same days


  //get the schedule of the faculty
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: {$in : days}
  }).select('days startTime endTime')
  
  console.log(assignSchedules)
  const newSchedule = {
    days,
    startTime,
    endTime
  }
  
  //'hasTimeConflict' import na kore direct ekahnei krle ei part tuku dilei hobe, nicher if ta dite hobe na.
  // assignSchedules.forEach((schedule) => {
  //   const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`)
  //   const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`)
  //   const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
  //   const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)
  // console.log(existingStartTime, existingEndTime, newStartTime, newEndTime)
  // if(newStartTime <existingEndTime && newEndTime>existingStartTime){
  //   throw new AppError(status.CONFLICT, `This faculty is not available at that time! choose other time or day!`)
  // }
  // })
 
  if(hasTimeConflict(assignSchedules, newSchedule)){
    throw new AppError(status.CONFLICT, `This faculty is not available at that time! choose other time or day!`)
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
  
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCoursequery = new QueryBuilder(OfferedCourse.find()
    .populate('course')
    .populate('faculty')
   .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment'), query)
    .sort()
    .fields()
    .filter()
    .paginate();

  const result = await offeredCoursequery.modelQuery;

  return result;
};


const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => { 
  //pagination setup

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });
  console.log(student?.academicDepartment)
  // find the student
  console.log('id',student)
  if (!student) {
    throw new AppError(status.NOT_FOUND, 'User is noty found');
  }

  //find current ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );
  console.log('c', currentOngoingRegistrationSemester)

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      status.NOT_FOUND,
      'There is no ongoing semester registration!',
    );
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};


const getSingleOfferedCourseIntoDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty'| 'startTime'| 'endTime'| 'days'>,
) => {
   
  const isOfferdCourseExists = await OfferedCourse.findById(id);
  if(!isOfferdCourseExists){
    throw new AppError(status.NOT_FOUND, 'offered course not found!')
  }

  const {faculty, days, startTime, endTime } = payload;
  const isFacultyExists = await Faculty.findById(faculty)
  if(!isFacultyExists){
    throw new AppError(status.NOT_FOUND, 'Faculty not found!')
  }
  
  const semesterRegistration = isOfferdCourseExists.semesterRegistration;
  
  //check offered course status which was made in semester registration,
  // without 'UPCOMING'status no offered course will be updated
  const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);
  if(semesterRegistrationStatus?.status !=='UPCOMING'){
      throw new AppError(
        status.BAD_REQUEST,`You can not update this offered course as it is ${semesterRegistrationStatus?.status}`
      )
  }
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: {$in : days}
  }).select('days startTime endTime')
  
  //console.log(assignSchedules)
  const newSchedule = {
    days,
    startTime,
    endTime
  }
  if(hasTimeConflict(assignSchedules, newSchedule)){
    throw new AppError(status.CONFLICT, `This faculty is not available at that time! choose other time or day!`)
  }

  const result = await OfferedCourse.findByIdAndUpdate(
    id,
    payload,
    {new: true}
  )
  return result;

};

const deleteOfferedCourseFromDB = async(id: string) => {
  const session = await mongoose.startSession()
try {
  session.startTransaction()
  const offeredCourse = await OfferedCourse.findById(id);
  if(!offeredCourse){
    throw new AppError(status.NOT_FOUND, 'This offered course is not exist!')
  }
  const semesterRagistration = await SemesterRegistration.findById(offeredCourse.semesterRegistration)
  if(semesterRagistration?.status !== 'UPCOMING'){
    console.log(true)
    throw new AppError(status.FORBIDDEN, `This offered course can not be deleted right now with ${semesterRagistration?.status} status`)
  }
  if(offeredCourse.isDeleted === true && semesterRagistration.isDeleted === true){
    throw new AppError(status.FORBIDDEN, 'The course is already deleted')
  }
 
 const deleteOfferedCourse =await OfferedCourse.findByIdAndUpdate(
  id,
  {isDeleted: true},
  {new: true, session}
 )
  if(!deleteOfferedCourseFromDB){
    throw new AppError(status.BAD_REQUEST, 'Offered course can not be deleted')
 }

 const deleteSemesterRegistration = await SemesterRegistration.findByIdAndUpdate(
  offeredCourse.semesterRegistration,
{isDeleted: true},
{new: true, session}
)
 if(!deleteSemesterRegistration){
  throw new AppError(status.BAD_REQUEST, 'Registered semester can not be deleted')
 }
 
 await session.commitTransaction();
 await session.endSession()
 return deleteOfferedCourse;

}catch (err) {
 await session.abortTransaction();
 await session.endSession()
 throw new AppError(status.BAD_REQUEST, (err as Error).message || 'Something went wrong')

}

}

export const OfferedOurseService = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
}
