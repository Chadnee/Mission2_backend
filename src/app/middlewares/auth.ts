import status from 'http-status';
import AppError from '../Error/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.schemaAndModel';

    const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    // console.log('token', token );
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized, no token');
    }
       //let decoded : JwtPayload
      
            //when access token will be expired 
                 try {
        const decoded = jwt.verify(
            token,config.jwt_access_secret as string)as JwtPayload;
          console.log(decoded.role)
          } catch(err) {
          throw new AppError(status.UNAUTHORIZED, 'Expired') //when access token is expired, it will show the 401 error status
        }
          const decoded = jwt.verify(
            token,config.jwt_access_secret as string)as JwtPayload;

          
    console.log(decoded);
        const {role, userId, iat}= decoded;
        console.log(role)
          if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(status.UNAUTHORIZED, 'You are not authorized hi');
          }

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
    
          // decoded is valid
          req.user = decoded as JwtPayload;
          next();
        });
         

  }

export default auth;