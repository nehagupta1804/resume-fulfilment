
const express = require('express');
const port = process.env.PORT;
const app= express();
const mongoose = require("./config/mongoose");
const User = require('./models/user');
const https = require('https');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
var id;
app.post('/',function(req,res){

 
  var action = req.body.queryResult.action;
  if(action =="getName"){

      
      User.create({
        name:req.body.queryResult.queryText,
        education:"N.A",
        experience:"N.A",
        project:"N.A",
        skills:"N.A",
        interests:"N.A",
        achievements:"N.A"

        
    },function(err,user)
    {
        if(err)
        {
            console.log("Error");
            return;
        }
        console.log(" user created \n");
          id = user._id;
          console.log(id);
          return res.json(200,
            {
              "fulfillmentMessages": [
                {
                  "text": {
                    "text": ["Enter skills"]
                  }
                }
              ]
                
            });    
        
    });
  
  }
  else if(action=="getSkills"){


    User.findByIdAndUpdate(id,{"skills":req.body.queryResult.queryText},function(err,user)
        {
           if(err)
           {
             console.log("cant be update");
             return;
           }
           console.log("updated");
        });

  }
  else if(action == "getJobBySkill"){
    var skill = req.body.queryResult.parameters["skill_name"];

    https.get("https://jobs.github.com/positions.json?description="+skill+"&location=new+york", (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      
      var jobsArray =  JSON.parse(data);
      var result="";
      for(var i=0;i<jobsArray.length;i++)
      {
          result+= (i+1).toString()+jobsArray[i].title +" and "+ jobsArray[i].url +"  \n";
      }
      return res.json(200,
          {
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [result +"Want to create resume?"]
                }
              }
            ]
              
          });

      
    
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
    
  }
});
app.listen(port,function(err){
    if(err){
       console.log("Error in running server");
    }
    console.log("server started");
    
});