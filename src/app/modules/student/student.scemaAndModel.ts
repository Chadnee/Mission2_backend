import { model, Schema } from "mongoose";
import {StudentModel, TGuardian, TLocalGuardian, TStudent, TUserName} from "./student.interface";
import validator from 'validator';
import bcrypt from 'bcrypt'
import config from "../../config";
import { User } from "../user/user.schemaAndModel";
import AppError from "../../Error/AppError";
import status from "http-status";

//sub schema:

export const nameSchema = new Schema<TUserName>({
    firstName: {
        type:String,
        required: true,
    },
    middleName: {
        type:String,
    },
    lastName: {
        type:String,
        required: [true, 'Last name is must be required'],
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: "{VALUE} is not valid",
        }
    }
})

const guardianSchema = new Schema<TGuardian>({
    fatherName: {type:String, required: true},
    fatherOccupation: {type:String, required: true},
    fatherContactNo: {type:String, required: true},
    motherName: {type:String, required: true},
    motherOccupation: {type:String, required: true},
    motherContactNo: {type:String, required: true},
})

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: {type:String, required: true},
    occupation: {type:String, required: true},
    contactNo: {type:String, required: true},
    address: {type:String, required: true},
})
const studentSchema = new Schema<TStudent, StudentModel>({
    id: {type: String, unique:true},
    // password: {type: String, required: true, maxlength:[20, 'password can not be more than 20 characters']},
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'user Id is required'], unique:true,
        ref: 'User',
    },
    name: {type: nameSchema, required: [true, "name is must be required"]},
    gender: {type: String, required: [true, 'Gender is must be required'],
         enum: {values: ["male", "female"], message: '{VALUE} is not valid or supported'},
        // message: "The gender can only be one of the from 'male', 'female', or 'other'."
        
    },
    dateOfBirth:{type: String},
    email: {type:String, required: true, unique:true,
    
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "{VALUE} is not a valid email"
      }
    },
    contactNo: {type:String, required: true},
    emergencyContactInfo: {type:String, required: true},
    bloodGroup: {type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]},
    presentAddress: {type:String, required: true},
    permanentAddress: {type:String, required: true},
    guardian:{type: guardianSchema, required: [true, "guardian is must be required"]},
    localGuardian: {type: localGuardianSchema, required: [true, "Local guardian is must be required"]},
    profileImage: {
        type:String,
        default: ''
    },
    admissionSemester: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSemester' //jeta export koreci seta noy, ()er vitorer model name dite hobe, tobe quation chara dile export name deya jabe , 
        // ete mongoose name dhore model khuje nibe, but eta best practive or best dveloper er kaj noy
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'academicDepartment', //jeta export koreci seta noy, ()er vitorer model name dite hobe
        // ete mongoose name dhore model khuje nibe, but eta best practive or best dveloper er kaj noy
        required:true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required:true 
    },
//    isActive:{type: String, enum:["active", "blocked"], default:"active"},
    isDeleted: {type: Boolean, default: false}
  })



//query middleware for handling delete method

studentSchema.pre('find', function(next){
    this.find({isDeleted: {$ne: true}}),
    next()
})

// studentSchema.post('find', function(docs, next){
//     console.log(docs.length)
//     if(docs.length === 0){
//         throw new AppError(status.BAD_REQUEST,"though success is true but it the data is empty, something went wrong")
//     }
//     next()
// })

studentSchema.pre("findOne", function(next){
    this.find({isDeleted: {$ne: true}}),
    next()
})

// studentSchema.pre('findOne', async function(next){
//     const query = this.getQuery();
//     console.log(query._id)

// // const isStudentExist = await Student.findOne({_id: query._id})
// //     if(!isStudentExist){
// //         throw new AppError(status.NOT_FOUND, "The student is not esxisted")
// //     }

//     next()
// })
//statics method
studentSchema.statics.isUserExists = async function (id: string){
 const existingUser = await this.findOne({ id }).lean()
// console.log(existingUser)
 return existingUser;
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema);