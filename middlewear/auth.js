const jwt = require('jsonwebtoken');
const { userModel } = require('../DB/model/user.model');


const auth =  ()=>{

    try{

        return async (req,res,next)=>{

            const {token}= req.headers;
            const decoded = jwt.verify(token,process.env.TokenSignature); 
            const user = await userModel.findById(decoded.id).select('_id');
            req.user=user;
            next();
        
    
    }


    }catch(error){
        
        res.json({message:"error",error});
    }

 }

module.exports=auth;
