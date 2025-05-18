// const express = require('express')
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoute } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandlers';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app = express();

//parsers
app.use(cookieParser())
app.use(express.json());
app.use(cors({origin: ['http://localhost:5173']}));

//application routes

//api/v1/students/create-student
app.use("/api/v1", router );
// app.use("/api/v1", UserRoutes)

app.get('/', async(req: Request, res: Response) => {
  // const a = 10;
   //res.send("hello worldddd");
   Promise.reject();
});

//calling middlewere for not found and global error handler to handle centrally
app.use(notFound);
app.use(globalErrorHandler);

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     const statusCode = 500;
//     const message = err.message || "Something went wrong!";

//     return res.status(statusCode).json({
//       success: false,
//       message,
//       error: err,
//     });
//   })
export default app;
// console.log(process.cwd());

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
