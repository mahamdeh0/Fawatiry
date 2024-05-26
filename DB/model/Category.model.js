const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    categorys:[
        {

            type:String,
           
    
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
},{timestamps:true});


const categoryModel = mongoose.model('category',categorySchema);

module.exports={categoryModel};
