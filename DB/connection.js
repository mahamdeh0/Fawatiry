const mongoose = require('mongoose');


const connectDB = async ()=>{

    return await mongoose.connect("mongodb+srv://admin:admin@cluster0.1mpshqq.mongodb.net/")
    .then((result)=>{

        console.log("connect DB");
    }).catch((error)=>{
        console.log(`error,${error}`);
    });
}

module.exports= connectDB;