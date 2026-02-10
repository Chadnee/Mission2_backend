import jwt, { Secret, SignOptions }  from "jsonwebtoken"
export const createToken = (
    jwtPayLoad: {userId: string; role:string},
    secret: Secret,
    expiresIn: SignOptions['expiresIn']
):string => {
    
    return jwt.sign(jwtPayLoad, secret, {expiresIn})
}
// import jwt  from "jsonwebtoken"
// export const createToken = (
//     jwtPayLoad: {userId: string; role:string},
//     secret: string,
//     expiresIn: string,
// ) => {
//     return jwt.sign(jwtPayLoad, secret, {expiresIn})
// }