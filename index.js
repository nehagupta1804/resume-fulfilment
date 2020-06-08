
const express = require('express');
const port = process.env.PORT;
const app= express();
const mongoose = require("./config/mongoose");
const User = require('./models/user');
const https = require('https');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.post('/',function(req,res){

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
                "text": [result]
              }
            }
          ]
            
        });

    
   
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
   
   
 })
app.listen(port,function(err){
    if(err){
       console.log("Error in running server");
    }
    console.log("server started");
    User.create({
      name:"neha",
      education:"experience",
      experience:"abc",
      project:"xyz",
      skills:"c++",
      interests:"dance",
      achievements:"kpit"

      
  },function(err,user)
  {
        if(err)
        {
            console.log("Error");
            return;
        }
        console.log("user created");
       
  })
})