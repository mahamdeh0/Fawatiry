const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName:{

        type:String,
        required:true,

    },
    email:{

        type:String,
        required:true,
        unique:true,
    },
    password:{

        type:String,
        required:true,
    },
    age:{
        type:Number,

    },
    confirmEmail:{

        type:Boolean,
        default:false,
    },
    gender:{
        type:String,
        default:"male",
        enum:['male','female'],
    }

},{timestamps:true});


const userModel = mongoose.model('User',userSchema);

module.exports={userModel};
