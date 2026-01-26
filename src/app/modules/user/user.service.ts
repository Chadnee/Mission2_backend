import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.schemaAndmodel";
import { TStudent } from "../student/student.interface"
import { Student } from "../student/student.scemaAndModel";
import { TUser } from "./user.interface";
import { User } from "./user.schemaAndModel"
import { generatedAdminId, generatedFacaultiesId, generatedStudentId } from "./user.utils";
import AppError from "../../Error/AppError";
import status from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.schemaAndModule";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.schemaAndModel";
import { sendImageCloudinary } from "../../utils/sendImageToCloudinary";
import { AcademicDepartment } from "../academic Department/academicDepartment.schemaAndModel";
import QueryBuilder from "../../builder/queryBuilder";
import { userSearchableFields } from "./user.constant";
import { visitor } from "./visitState.schema";

const createStudentUserIntoDB = async(file:any, password: string, studentData: TStudent) => {
    
    let userData:Partial<TUser> = {};

    //if user is not given, use default password by  importing from config
    userData.password = password || (config.default_password as string)
    
    //set student role 
    userData.role = 'student'
    userData.email = studentData.email;
    //set mannually generated id
    //userData.id = '2025100001'

    const admissionSemester = await AcademicSemesterModel.findById(studentData.admissionSemester);
    if(!admissionSemester){
        throw new Error('Admission semester not found')
    };
    //console.log(admissionSemester)
          const academicDepartment = await AcademicDepartment.findById(studentData.academicDepartment);
          if(!academicDepartment){
            throw new AppError(status.NOT_FOUND, "The academic department is not found!")
          }

    const session = await mongoose.startSession();

    try{
          session.startTransaction();
          //set generated id
          userData.id = await generatedStudentId(admissionSemester)
          if(file) {
             const imageName = `${userData?.id}${studentData?.name?.firstName}`
          const path = file?.path
        //  sendImageCloudinary(imageName, path)
         const {secure_url} = await sendImageCloudinary(imageName, path)
           studentData.profileImage=secure_url as string;
          }
         //create a user
          const newUser = await User.create([userData], {session});
      
          if(!newUser.length){
               throw new AppError(status.BAD_REQUEST, 'Failed to create user')
          }
          

         
          if(Object.keys(newUser).length){
              //set id, _id as user
              studentData.id = newUser[0].id; //embedding id
              studentData.user= newUser[0]._id;//reference _id
              studentData.academicFaculty=academicDepartment.academicFaculty;
      
              const newStudent = await Student.create([studentData], {session});
      
              if(!newStudent.length){
                 throw new AppError(status.BAD_REQUEST, "Failed to create a student");
              }
      
              await session.commitTransaction();
              await session.endSession();
              
              return {newStudent, newUser};
          }
    
} catch(err) {
   await session.abortTransaction();
   await session.endSession();
   throw new AppError(status.BAD_REQUEST, err)
}
    
}

const createFacultyUserIntoDB = async(file:any, passWord: string, facultyData:TFaculty)=>{
    let userData: Partial<TUser> = {}
    
    userData.password = passWord || config.default_password

    //set faculties role

    userData.role = 'faculty'
    userData.email = facultyData.email;
    const academicDepartment = await AcademicDepartment.findById(facultyData.academicDepartment);
    if(!academicDepartment){
        throw new AppError(status.NOT_FOUND, 'Department is not found')
    }

    const session = await mongoose.startSession();
    session.startTransaction()

    try{
       userData.id = await generatedFacaultiesId();
      if(file) {
          
       const path = file.path;
       const imageName = `${userData?.id}_${facultyData?.name}`
       const {secure_url} = await sendImageCloudinary(imageName, path);
       facultyData.profileImage = secure_url as string;

      }
       const newUser = await User.create([userData], {session})
       if(!newUser.length){
        throw new AppError(status.BAD_REQUEST, 'User creation is failed')
       }
       if(Object.keys(newUser).length){
        facultyData.id = newUser[0].id;
        facultyData.user = newUser[0]._id;
        facultyData.academicFaculty = academicDepartment.academicFaculty;

        const newFaculty = await Faculty.create([facultyData], {session})

        if(!newFaculty.length) {
            throw new AppError(status.BAD_REQUEST, "New faculty creation is failed")
        }

        await session.commitTransaction();
        await session.endSession
        return {newFaculty, newUser};
       }
    }catch(err){
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, err)
    }

}

const createAdminUserIntoDB = async(file:any, password: string, adminData: TAdmin) => {
    let userData: Partial<TUser> = {};
    userData.password = password || config.default_password;
    userData.role = "admin";
    userData.email = adminData.email;

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        userData.id = await generatedAdminId();
        if(file) {
        const path = file.path;
        const imageName = `${userData?.id}_${adminData?.name}`
        const {secure_url} = await sendImageCloudinary(imageName, path);
        adminData.profileImage = secure_url as string;

        }
        const newUser = await User.create([userData], {session})
        if(!newUser.length){
         throw new AppError( status.BAD_REQUEST, "Failed to create new User!")
     };
 
     if(Object.keys(newUser).length){
         adminData.id = newUser[0].id;
         adminData.user = newUser[0]._id;
     }
 
        const newAdmin = await Admin.create([adminData], {session})
         if(!newAdmin){
          throw new AppError(status.BAD_REQUEST, "Failed to create new admin")
         }
         await session.commitTransaction();
         await session.endSession();
         return newAdmin;
        }catch(err){
         await session.abortTransaction();
         await session.endSession()
         throw new AppError(status.BAD_REQUEST,err)
     }
    }

    const getAllUserFromDB = async(query: Record <string, unknown>)=> {
        const user = new QueryBuilder(User.find(),query)
        .search(userSearchableFields)
        .fields()
        .sort()
        .paginate()
        .fields()
        const result = await user.modelQuery
        const meta = await user.countTotal()

        return {
            result, 
            meta
        }
    }

const getMeFromDB = async(userId: string, role: string)=>{
     let result = null;

     if(role === 'student'){
        result = await Student.findOne({id: userId})
     };
     if(role === 'admin'){
        result = await Admin.findOne({id: userId})
     };
     if(role === 'faculty'){
        result = await Faculty.findOne({id: userId})
     };
     return result;
}

const getUserCountsForAdminDashBoardFromDB = async () => {
    const counts = await User.aggregate([
        {
            $group: {
                _id: '$role',
                total: {$sum: 1}
            }
        }
    ])
    return{
        students: counts.find(c => c._id === 'student')?.total || 0,
        faculty: counts.find(c => c._id === 'faculty')?.total || 0,
        admins: counts.find(c => c._id === 'admin')?.total || 0,

    }
}

//tracking visistor , How many people visist this website
const trackVisitorsIntoDB = async( ip: string, userAgent?: string) => {
 const today = new Date();
 today.setHours(0,0,0,0) //start of Day
 
 const alreadyVisited = await visitor.findOne({
    ip,
    createdAt: {$gt: today}
 });

 if(!alreadyVisited){
    await visitor.create({ip, userAgent});
 }

}

const getVisitorsStateFromDB = async() => {
    const totalVisistors = await visitor.countDocuments()

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayVisitors = await visitor.countDocuments({
        createdAt: {$gte: today}
    })
    return {
        totalVisistors,
        todayVisitors
    }
}
export const UserServices = {
    createStudentUserIntoDB,
    createFacultyUserIntoDB,
    createAdminUserIntoDB,
    getAllUserFromDB,
    getUserCountsForAdminDashBoardFromDB,
    getMeFromDB,
    trackVisitorsIntoDB,
    getVisitorsStateFromDB,
}
// import config from "../../config";
// import { AcademicSemesterModel } from "../academicSemester/academicSemester.schemaAndmodel";
// import { TStudent } from "../student/student.interface"
// import { Student } from "../student/student.scemaAndModel";
// import { NewUser, TUser } from "./user.interface";
// import { User } from "./user.schemaAndModel"
// import { generatedStudentId } from "./user.utils";

// const createUserIntoDB = async(password: string, studentData: TStudent) => {
    
//     let userData:Partial<TUser> = {};

//     //if user is not given, use default password by  importing from config
//     userData.password = password || (config.default_password as string)
//     // if (!password){
//     //     user.password = config.default_password as string;
//     // } else {
//     //     user.password = password;
//     // }

//     //set student role
//     userData.role = 'student'
//     //set mannually generated id
//     //userData.id = '2025100001'

//     const admissionSemester = await AcademicSemesterModel.findById(studentData.admissionSemester);
//     if(!admissionSemester){
//         throw new Error('Admission semester not found')
//     };
//     //console.log(admissionSemester)
//  userData.id = await generatedStudentId(admissionSemester)
 

//     const result = await User.create(userData);
    
//     if(Object.keys(result).length){
//         //set id, _id as user
//         studentData.id = result.id; //embedding id
//         studentData.user= result._id;//reference _id

//         const newStudent = await Student.create(studentData);
//         return newStudent;
//     }
    
// }

// export const UserServices = {
//     createUserIntoDB,
// }




// import config from "../../config";
// import { TStudent } from "../student/student.interface";
// import { Student } from "../student/student.scemaAndModel";
// import { NewUser, TUser } from "./user.interface";
// import { User } from "./user.schemaAndModel";

// const createUserIntoDB = async(password:string, studentData: TStudent) => {
//     //console.log('student data check :', studentData)
//      // static method
//      //const existingUser = await Student.isUserExists(studentData.id);
//     // console.log("Existing user check:", existingUser);
   
   
//    // if (await Student.isUserExists(studentData.id)){
//    //     throw new Error('User already exists!');
//    // }

//    const userData:Partial<TUser> = {};
//    //if password is not given , use default password;
//     userData.password = password || (config.default_password as string)
//    //set student role
//    userData.role = 'student';
//    userData.id = '1234@567d';

//    const newUser = await User.create(userData);

//    //create a student
//    if (Object.keys(newUser).length){
//     studentData.id = newUser.id; //embedding id
//     studentData.user = newUser._id; //reference _id

//     const newStudent = await Student.create(studentData);
//     return newStudent;
//    }
// }

// export const UserServices = {
//     createUserIntoDB,
// }