const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { json } = require("body-parser");
const res = require("express/lib/response");



router.post("/login", validateUser, async (req,res,next)=>{
    debugger
    try {
        const { username, age, password } = req.body;

        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({ id, username, age, password });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: "sucess" });
    } 
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }

  });


router.patch("/:userid",validateUser,async(req,res,next)=>{
    try{
          const{username,password,age}=req.body;
          const users=await fs.promises.readFile('/user.json',{encoding:"utf8"}).
          then((data)=>JSON.parse(data));
            
          const newuser=users.map((user)=> {
          if(user.id !==req.params.userid) return user;
        return{
            username,
            password,
            age,
            id:req.params.userid};
            
            });
            await fs.promises.writeFile('/user.json',JSON.stringify(newuser),{encoding:"utf8"});
            res.status(200).send({message:"user edited"})
        }
    
  catch(error){
           next({status:500,internalmessage:error.message})
    }
})
router.get('/',validateUser,async(req,res,next)=>{
  try{
      const age=Number(req.query.age)
       
      const users= await fs.promises.readFile('/user.json',{encoding:"utf8"}).then((data)=>{
        JSON.parse(data);
    });
          if(!age){
              return users
          }
          else{
          const requiredusers=users.filter((user)=>{
              user.age===age
          })
          
          res.send(requiredusers)};
}

catch(error){
             next({status:500,internalMessage:error.message})

  }


})
router.post('/login',validateUser,async(req,res,next)=>{
    try{
    const{username,password,age}=req.body;
    const data=await fs.promises.readFile('/user.json',{encoding:"utf8"}).then((data)=>JSON.parse(data));
    const newuser={
        username,
        password,
        age,
        id:uuidv4
    }
    data.push(newuser);
    await fs.promises.writeFile('/user.json',JSON.stringify(newuser),{encoding:"utf-8"});
    res.status(200).send({message:"success"})

}
catch(error){
        next({status:403,internalMessage:error.message})
}
})

router.get('/',validateUser,async(req,res,next)=>{
    try{
        const id=Number(req.query.id)
        const users=await fs.promises.readFile('/user.json',{encoding:"utf8"}).then((data)=>{
            JSON.parse(data);
        })
        const filteredUser=users.filter(user=>{
            user.id===id
        })
        res.send(filteredUser)
        res.status(200).send({message:"success"})
    }
    catch(error){
        next({status:404,internalMessage:error.message})
    }
})



router.delete('/:id',validateUser,async(req,res,next)=>{
    try{
    const id=Number(req.query.id);
    const users=await fs.promises.readFile('/user.json',{encoding:"utf8"}).then((data)=>{
        JSON.parse(data);
    })
    const newusers=users.filter((user)=>!user.id===id)
    await fs.promises.writeFile('/user.json',JSON.stringify(newusers),{encoding:"utf-8"});
    res.status(200).send({message:"success"})
}
catch(error){
    next({status:404,internalMessage:error.message})
}
})
module.exports = router;
