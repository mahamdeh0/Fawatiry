const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({

    containers:[
        {

            type:String,
           
    
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
},{timestamps:true});


const containerModel = mongoose.model('Containers',containerSchema);

module.exports={containerModel};
