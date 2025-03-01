// const express = require('express')
import express, { Request, Response } from 'express';
import cors from 'cors';
const app = express();

//parsers

app.use(express.json());
app.use(cors());



app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
});

export default app;
console.log(process.cwd());

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
