import { TErrorSource, TGenericErrorResponse } from './../interface/error';
const handleDuplicateError = (err: any): TGenericErrorResponse=> {
    const match = err.message.match(/dup key:.*?"(.*?)"/);

    const extract_msg = match && match[1];
    
    const errorSource: TErrorSource = [
        {
            path: '',
            message:`${extract_msg} is already exist`
        }
    ]

    const statusCode = 400

    return {
        statusCode,
        message: "It make duplicate error",
        errorSource
    }
}

export default handleDuplicateError;