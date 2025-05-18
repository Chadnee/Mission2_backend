import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../Error/handleZodError';
import hanldeValidationMongooseError from '../Error/handleValidationMongooseError';
import handleCastError from '../Error/handleCastMongooseError';
import handleDuplicateError from '../Error/handleDuplicateError';
import AppError from '../Error/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

  //  let statusCode = err.statusCode || 500;
//  let message = err.message || 'Something went wrong!';


  let statusCode = 500;
 let message = 'Something went wrong!';



  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong'
    },
  ];
 
 

  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err)

    statusCode = simplifiedZodError.statusCode,
    message = simplifiedZodError.message,
    errorSource = simplifiedZodError.errorSource

    // console.log(simplifiedZodError);

  } else if(err?.name === 'ValidationError') {
    const simplifiedMongooseError = hanldeValidationMongooseError(err);
    statusCode = simplifiedMongooseError?.statusCode;
    message = simplifiedMongooseError.message;
    errorSource = simplifiedMongooseError.errorSource

  }else if(err.name === "CastError") {
    const simplifiedMongooseError = handleCastError(err);
    statusCode= simplifiedMongooseError.statusCode,
    message= simplifiedMongooseError.message,
    errorSource = simplifiedMongooseError.errorSource

  } else if ( err.code === 11000){
    const simplifiedDuplicateError = handleDuplicateError(err);
    statusCode = simplifiedDuplicateError.statusCode;
    message= simplifiedDuplicateError.message;
    errorSource = simplifiedDuplicateError.errorSource
  } else if (err instanceof AppError) {
    statusCode= err.statusCode,
    message = err.message,
    errorSource = [
      {
        path: '',
        message: err?.message
      }
    ]
  } else if (err instanceof Error) {
    message = err.message,
    errorSource = [
      {
        path :'',
        message : err.message
      }
    ]
  }
  
  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.node_env === 'development' ? err.stack : null,
  });
};
export default globalErrorHandler;
