var jwt = require('jsonwebtoken');
const { secret } = require('../serverconfig');

const User=require('../models/User')
const auth=async(req,res,next)=>{
    
    const token=req.headers.token;
 
    try {
       const decoded=jwt.verify(token,secret);
        req.user= await User.findById(decoded.id)
    } catch (error) {
        next({status:401,message:"authentication error"})
    }
}
module.exports={
    auth
}