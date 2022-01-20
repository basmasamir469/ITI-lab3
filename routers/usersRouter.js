const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { json } = require("body-parser");
const res = require("express/lib/response");
const serverconfig=require('../serverconfig.js')
var jwt = require('jsonwebtoken');
const { auth } = require("../middlewares/auth");
require("../mongoconnect.js")

const User = require("../models/User.js");

router.post("/", async (req,res,next)=>{
  
    try {
      
        const { username, password ,age} = req.body;
        
        const user=new User({username,password,age});
        console.log(user);

        await user.save();
        res.send({ id, message: "sucess" });
     
       
    } 
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }

  });



  router.post("/login", async (req,res,next)=>{
   
    try {
       
        const { username, password } = req.body;

        const user=await User.findOne({username})
        if(!user) return next({status:401,message:"user not found"})
        if(user.password!==password) next({status:401,message:"password is uncorrect"})
       
        const payload={id:user.id};
        const token= jwt.sign( payload,serverconfig.secret,{expiresIn:"1h"});
      
        return res.status(200).send({ message: "logged in sucessfully" ,token});

      
    } 
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }

  });


router.patch("/:userid",auth,async(req,res,next)=>{
    try{
       
        if(req.user.id !== req.params.id) next({status:403,message:"authentication error"})
        const{password,age}=req.body;
        req.user.password=password;
        req.user.age=age
        console.log(req.user.age);

        await req.user.save();
         res.send("success")
      
         }
    catch(error){
           next({status:500,internalmessage:error.message})
    }
})

router.get('/',auth,async(req,res,next)=>{
  try{
      
        if(req.user.age==req.query.age){
      const query=req.query.age?{age:req.query.age}:{};
      const users= await User.find(query)
      console.log(users)
             res.send(users);
          }
        else if(req.user.username==req.query.username){
            const query=req.query.username?{username:req.query.username}:{};
            const users= await User.find(query)
                   res.send(users);
        }
        else{
            res.send('authentication error')
        }
       
}

catch(error){
             next({status:500,internalMessage:error.message})

  }


})






router.delete('/:id',auth,async(req,res,next)=>{
    try{
        debugger
        if(req.user.id=req.params.id) {
            await User.deleteOne({age:req.user.age})
            res.send("deleted")
        }
        else{
            res.send("authentication error")
        }
debugger
    
}
catch(error){
    next({status:404,internalMessage:error.message})
}
})


module.exports = router;
