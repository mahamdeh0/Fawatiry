require('dotenv').config()

const express = require('express')
const connectDB = require('./DB/connection');
const app = express()
const port = 3000;
const indexRouter = require('./modules/index.router')
app.use(express.json());
connectDB();

app.use('/api/v1/users',indexRouter.userRouter);


app.use ('*',(req,res)=>{

    res.json({message:"page not found"})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))