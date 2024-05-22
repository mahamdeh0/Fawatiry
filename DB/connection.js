const mongoose = require('mongoose');


const connectDB = async ()=>{

    return await mongoose.connect("")
    .then((result)=>{

        console.log("connect DB");
    }).catch((error)=>{
        console.log(`error,${error}`);
    });
}

module.exports= connectDB;