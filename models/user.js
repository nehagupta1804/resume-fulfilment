const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
          
        },
        email:{
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
        education:[  
            {   
                degree:{
                    type:String,
                    required:true
                },
                university_name:{
                    type:String,
                    required:true
                },
                location:{
                    type:String,
                    required:true
                },
                percentage:{
                    type:String,
                    required:true
                },
            }
        ],
        project:[
            {   
                title:{
                    type:String,
                    required:true
                },
                year:{
                    type:String,
                    required:true
                },
                description:{
                    type:String,
                    required:true
                },
            }
           
        ],
        experience:[
            {   
                position:{
                    type:String,
                    required:true
                },
                duration:{
                    type:String,
                    required:true
                },
                location:{
                    type:String,
                    required:true
                },
                company_name:{
                    type:String,
                    required:true
                },
            }
           
        ],
        achievements:[
        {
            achievement:{
                type:String,
                required:true,
                }
            }
        ],
    },
    {
        timestamps:true
    }

   
);


const User = mongoose.model('User',userSchema);
module.exports = User; 