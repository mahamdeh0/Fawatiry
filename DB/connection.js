const mongoose = require('mongoose');


const connectDB = async ()=>{

    return await mongoose.connect("mongodb://127.0.0.1:27017/fawateri")
    .then((result)=>{

        console.log("connect DB");
    }).catch((error)=>{
        console.log(`error,${error}`);
    });
}

module.exports= connectDB;