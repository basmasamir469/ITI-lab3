const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const userschema = new mongoose.Schema({
   username: { type: String,
              required: true,
              min:3,
              max:25,
              unique:true
    },
    
    password: {
      type: String,
      required: true,
      min:3,
      max:25
       
    },
    age:Number
  },
  {strict:false}
  );
  const User=mongoose.model('User',userschema);
  module.exports=User;