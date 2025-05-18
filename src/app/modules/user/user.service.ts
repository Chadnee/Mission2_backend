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

const createStudentUserIntoDB = async(password: string, studentData: TStudent) => {
    
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

    const session = await mongoose.startSession();

    session.startTransaction();

try{
          //set generated id
          userData.id = await generatedStudentId(admissionSemester)
 
          //create a user
          const newUser = await User.create([userData], {session});
      
          if(!newUser.length){
               throw new AppError(status.BAD_REQUEST, 'Failed to create user')
          }
          
          if(Object.keys(newUser).length){
              //set id, _id as user
              studentData.id = newUser[0].id; //embedding id
              studentData.user= newUser[0]._id;//reference _id
      
              const newStudent = await Student.create([studentData], {session});
      
              if(!newStudent.length){
                 throw new AppError(status.BAD_REQUEST, "Failed to create a student");
              }
      
              await session.commitTransaction();
              await session.endSession();
              
              return newStudent;
          }
    
} catch(err) {
   await session.abortTransaction();
   await session.endSession();
   throw new AppError(status.BAD_REQUEST, err)
}
    
}

const createFacultyUserIntoDB = async(passWord: string, facultyData:TFaculty)=>{
    let userData: Partial<TUser> = {}
    
    userData.password = passWord || config.default_password

    //set faculties role

    userData.role = 'faculty'
    userData.email = facultyData.email;

    const session = await mongoose.startSession();
    session.startTransaction()

    try{
       userData.id = await generatedFacaultiesId();

       const newUser = await User.create([userData], {session})
       if(!newUser.length){
        throw new AppError(status.BAD_REQUEST, 'User creation is failed')
       }
       if(Object.keys(newUser).length){
        facultyData.id = newUser[0].id;
        facultyData.user = newUser[0]._id;

        const newFaculty = await Faculty.create([facultyData], {session})

        if(!newFaculty.length) {
            throw new AppError(status.BAD_REQUEST, "New faculty creation is failed")
        }

        await session.commitTransaction();
        await session.endSession
        return newFaculty;
       }
    }catch(err){
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(status.BAD_REQUEST, err)
    }

}

const createAdminUserIntoDB = async(password: string, adminData: TAdmin) => {
    let userData: Partial<TUser> = {};
    userData.password = password || config.default_password;
    userData.role = "admin";
    userData.email = adminData.email;

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        userData.id = await generatedAdminId();
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
export const UserServices = {
    createStudentUserIntoDB,
    createFacultyUserIntoDB,
    createAdminUserIntoDB,
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