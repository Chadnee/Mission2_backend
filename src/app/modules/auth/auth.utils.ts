import jwt  from "jsonwebtoken"
export const createToken = (
    jwtPayLoad: {userId: string; role:string},
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayLoad, secret, {expiresIn})
}