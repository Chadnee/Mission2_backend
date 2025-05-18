import mongoose, { Mongoose } from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const hanldeValidationMongooseError = (err: mongoose.Error.ValidationError) : TGenericErrorResponse => {
    const errorSource: TErrorSource = Object.values(err.errors).map(
        (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
           
            return {
                path: value?.path,
                message: value.message
            }
        }
    )
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSource,
    }
    
}

export default hanldeValidationMongooseError;