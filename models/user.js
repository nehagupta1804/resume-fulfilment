
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
          
        },
        education:{
            type:String,
            required:true,
        },
        experience:{
            type:String,
            required:true,
        },
        project:{
            type:String,
            required:true,
        },
        skills:{
            type:String,
            required:true,
        },
        interests:{
            type:String,
            required:true,
        },
        achievements:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }

   
);


const User = mongoose.model('User',userSchema);
module.exports = User; 