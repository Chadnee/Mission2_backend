import status from "http-status";
import AppError from "../../Error/AppError";
import { User } from "../user/user.schemaAndModel";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import config from "../../config";
import { createToken } from "./auth.utils";
import { sendEmail } from '../../middlewares/sendEmail';

const loginUserIntoDB = async(payload: TLoginUser) => {
    //const isUserExists = await User.findOne({id: payload?.id});
    const userData =await User.isUserExistsByCustomeId(payload.id);

    //checking if user is not found
    if(!userData){
        throw new AppError(status.NOT_FOUND, 'User not found')
    }

    const isUserDeleted = await userData?.isDeleted;
    if(isUserDeleted){
        throw new AppError(status.FORBIDDEN, 'This user is deleted')
    }

    const userStatus = userData?.status;
    if(userStatus === 'blocked'){
        throw new AppError(status.FORBIDDEN, "This user is already blocked")
    }
     
    //checking if the password is correct or matching with before password
    // const isPasswordMatch = await bcrypt.compare(
    //     payload?.password, isUserExists?.password
    // )
    if(! await User.isPasswordMatched(payload?.password, userData?.password)){
        console.log(payload?.password, userData?.password)
    throw new AppError(status.FORBIDDEN, 'Password do not matched!')}
    // console.log(isPasswordMatch);
    
    const jwtPayload = {
        userId: userData.id,
        role: userData.role
    }
    //const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn:'10d' });
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as jwt.Secret, config.jwt_access_expiresIn )
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as jwt.Secret, config.jwt_refresh_expiresIn )
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData?.needsPasswordChange
    }
}

const changePasswordIntoDB = async(user:JwtPayload ,payload:
     {oldPassword: string; newPassword: string}) => {
     
    const userData =await User.isUserExistsByCustomeId(user.userId);

    //checking if user is not found
    if(!userData){
        throw new AppError(status.NOT_FOUND, 'User not found')
    }

    const isUserDeleted = await userData?.isDeleted;
    if(isUserDeleted){
        throw new AppError(status.FORBIDDEN, 'This user is deleted')
    }

    const userStatus = userData?.status;
    if(userStatus === 'blocked'){
        throw new AppError(status.FORBIDDEN, "This user is already blocked")
    }
     
    //checking if the password is correct or matching with before password
    // const isPasswordMatch = await bcrypt.compare(
    //     payload?.password, isUserExists?.password
    // )
    if(! await User.isPasswordMatched(payload.oldPassword, userData?.password)){
        console.log(payload?.oldPassword, userData?.password)
    throw new AppError(status.FORBIDDEN, 'Password do not matched!')}
    // console.log(isPasswordMatch);
    
    //hashed new password
    const newHashedpassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bycrypt_slat_rounds)
    )
   
    const result = await User.findOneAndUpdate({
        id: userData.id,
        role: userData.role,
    },
{
    password: newHashedpassword,
    needsPasswordChange: false,
    passWordChangedAt: new Date,
})

    return null;
}

const refreshTokenIntoDB = async(token: string)=>{
 if (!token) {
       throw new AppError(status.UNAUTHORIZED, 'You are not authorized, no token');
     }
       
     //checking if the given token is valid
         const decoded = jwt.verify(
             token,config.jwt_refresh_secret as jwt.Secret)as JwtPayload;
 
         const {role, userId, iat}= decoded;
 
            const userData =await User.isUserExistsByCustomeId(userId);
           
               //checking if user is not found
               if(!userData){
                   throw new AppError(status.NOT_FOUND, 'User not found')
               }
           
               const isUserDeleted = await userData?.isDeleted;
               if(isUserDeleted){
                   throw new AppError(status.FORBIDDEN, 'This user is deleted')
               }
           
               const userStatus = userData?.status;
               if(userStatus === 'blocked'){
                   throw new AppError(status.FORBIDDEN, "This user is already blocked")
               }
 
               if(userData?.passWordChangedAt && User.isJWTIssuedBeforePasswordChanged(
                 userData.passWordChangedAt,
                 iat as number,
               )) {
                 throw new AppError(status.UNAUTHORIZED, 'You are not authorized!(pass changed)')
               }

               const jwtPayload = {
                userId: userData.id,
                role: userData.role
            }
            const accessToken = createToken(
                jwtPayload, config.jwt_access_secret as jwt.Secret, 
                config.jwt_access_expiresIn
            )

                return {
                    accessToken,
                };
     
};

const forgetPasswordIntoDB = async(id: string) => {
  //checking if the users is exist
  const user = await User.isUserExistsByCustomeId(id);

  if(!user) {
    throw new AppError(status.NOT_FOUND, "Thes user is not exist!")
  }
  //checkng if the user is already blocked 
  if(user.status === "blocked"){
    throw new AppError(status.FORBIDDEN, "This user is alredy blocked!!")
  }
  //checkng if the user is already deleted
  if(user.isDeleted){
    throw new AppError(status.FORBIDDEN, "The user is already deleted!!")
  };

  const jwtPayload = {
    userId: user.id,
    role: user.role
  };
  const resetToken  = createToken(
    jwtPayload, config.jwt_access_secret as jwt.Secret, '10m'
  ); //which is also a accesstoken
  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
  //const resetUILink = `http://localhost:5174?id=${user.id}&token=${resetTokwn }`;
  //console.log(resetUILink, user.email)
  sendEmail(user.email, resetUILink);
 }

 const resetPaawordIntoDB = async(payload:{id: string, newPassword: string}, token: string) => {
         //checking if the users is exist
  const user = await User.isUserExistsByCustomeId(payload.id);

  if(!user) {
    throw new AppError(status.NOT_FOUND, "Thes user is not exist!")
  }
  //checkng if the user is already blocked 
  if(user.status === "blocked"){
    throw new AppError(status.FORBIDDEN, "This user is alredy blocked!!")
  }
  //checkng if the user is already deleted
  if(user.isDeleted){
    throw new AppError(status.FORBIDDEN, "The user is already deleted!!")
  };

  const decoded = jwt.verify(
    token, config.jwt_access_secret as string
  ) as JwtPayload;
  console.log({decoded})

  if(payload.id !== decoded.userId){
    throw new AppError(status.FORBIDDEN, "You are forbidden(id unmatched)")
  };
  //hash new password
  const hashedNewPassword = await bcrypt.hash(payload.newPassword,
    Number(config.bycrypt_slat_rounds)
  );

  const result = await User.findOneAndUpdate(
    {
        id: decoded.userId,
        role: decoded.role
    },
    {
        password: hashedNewPassword,
        needsPasswordChange: false,
        passWordChangedAt: new Date()
    }
  )
  return result;
 }




export const AuthService = {
    loginUserIntoDB,
    changePasswordIntoDB,
    refreshTokenIntoDB,
    forgetPasswordIntoDB,
    resetPaawordIntoDB,
}

