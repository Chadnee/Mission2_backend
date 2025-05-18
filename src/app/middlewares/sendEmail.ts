import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async(to:string, html:string) => {
  // console.log(to)
    
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_env === 'production', // true for 465, false for other ports
    auth: {
      user: "mstchadneeakhter@gmail.com",
      pass: "tevo oenq svrw uciv",
    },
  });
  
  // Wrap in an async IIFE so we can use await.
  await transporter.sendMail({
        from: 'mstchadneeakhter@gmail.com',
        to,
        subject: "changed your password",
        text: "hey, plaese change your password to secured account", // plain‑text body
        html, // HTML body
      });
    
    
}

//Mischadnee@123