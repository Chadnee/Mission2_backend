import app from "./app";
import { seedSuperAdmin } from "./app/modules/DB";
import dbConnect from "./lib/dbConnect";

async function bootsTrap() {
  await dbConnect();
  await seedSuperAdmin()
}

bootsTrap().catch(console.error)

export default app;
// import app from './app';
// import config from './app/config';

// // getting-started.js
// // const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// import { Server } from 'http';
// import { seedSuperAdmin } from './app/modules/DB';

// let server : Server;

// async function main() {
//   try {
//    // console.log(config.database_url)
//     await mongoose.connect(config.database_url as string, {
//       autoIndex: true
//     });
//    await seedSuperAdmin() //check is super admin exist? if not, it will create super admin to the first user 
//    server = app.listen(config.port, () => {
//       console.log( `app listening on port ${config.port}`);

//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

// main();

// process.on('unhandledRejection', ()=> {
//   console.log(`unhandledRejection is detected, shutting down... `);

//  if (server) {
//   server.close(() => {
//     process.exit(1);
//   })
//  } 
//   process.exit(1);
// })


// process.on('uncaughtException', () => {
//   console.log(`uncaught Exception is detected, shutting down... `);
//   process.exit(1)
// })
// // console.log.log(jjhjj) // uncaught Exception dhora prbe