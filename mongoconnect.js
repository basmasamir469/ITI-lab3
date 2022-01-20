const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/finallab').then(()=>{
 console.log('connected');
});
