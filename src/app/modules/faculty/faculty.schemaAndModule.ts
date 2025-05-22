import { model, Schema, Types } from "mongoose";
import { TFaculty } from "./faculty.interface";
import AppError from "../../Error/AppError";
import status from "http-status";

const facultySchema = new Schema<TFaculty>({
    id: {
        type: String,
        required: [true, 'Generated Id is required'],
    },
    designation: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true 
    },
    gender: {
        type: String,
        required:true,
        enum: {values:["male", "female"], message: '{VALUE} is not valid or supported'},
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: String,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
       profileImage: {
        type:String,
        default: ''
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref :'academicDepartment',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true}
)
// it is not good practice
// facultySchema.pre('findOne', function(next){
//     const query = this.getQuery;
//     const facultyId = Faculty.findOne(query);

//     if(!facultyId){
//         throw new AppError(status.NOT_FOUND, "The faculty id is not existed")
//     }
//     next();
// })

export const Faculty = model<TFaculty>("faculty", facultySchema)