import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";
const userSchema = new Schema<TUser, UserModel>({
    id: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: 0,
      },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passWordChangedAt: {
        type: Date
    },
    role: {
        type: String,
        enum:['superAdmin', 'admin' , 'student' , 'faculty'],
    },
    status: {
        type: String,
        enum: [ 'in-progress','blocked'],
        default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
    default: false,
    },
 }, {timestamps: true}
)

userSchema.pre('save', async function (next){
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bycrypt_slat_rounds)
    );
})

userSchema.post('save', function(doc, next) {
    doc.password = '';
    next();
})

userSchema.statics.isUserExistsByCustomeId = async function(id:string ) {
 return await User.findOne({id}).select('+password');
}
userSchema.statics.isPasswordMatched = async function(plainTextPassword, hashedPassword){
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}
userSchema.statics.isJWTIssuedBeforePasswordChanged = function(
    passWordChangedTimestamp : Date,
    jwtIssuedTimestamps: number,
) {
    const passWordChangedTime =
    new Date(passWordChangedTimestamp).getTime() /1000 ;
    return passWordChangedTime> jwtIssuedTimestamps
}




export const User = model<TUser, UserModel>('user', userSchema);






















// import { model, Schema } from "mongoose";
// import { TUser } from "./user.interface";
// import bcrypt from 'bcrypt'
// import config from "../../config";

// const userSchema = new Schema<TUser>({
//     id: {
//         type: String, required: true, unique:true
//     },
//     password: {
//         type: String, required: true,
//     },
//     needsPasswordChange: {
//         type: Boolean, default: true,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'faculty', 'student']
//     },
//     status: {
//         type: String,
//         enum: ['in-progess', 'blocked']
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     }
// }, {timestamps: true})


// //pre save middleware/ hook

// userSchema.pre('save', async function(next) {
//     // console.log(this, "pree savings")
//     const user = this;
//     user.password = await bcrypt.hash(user.password, Number(config.bycrypt_slat_rounds));
//     next()
// })

// //post save middleware/ hook
// userSchema.post('save', function(doc, next){ //jehetu document peye gechi tai this na dhore direct doc dhorlam
//     doc.password = "";
//     next()
//     // console.log(this, 'save posttt')
// })

// export const User = model<TUser>('User', userSchema)