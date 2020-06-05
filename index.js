const express = require('express');
const port = process.env.PORT;
const app= express();
app.get('/',function(req,res){
     return res.json(200,
         {
             message:"List of posts",
             posts:"hey"
         });
 })
app.listen(port,function(err){
    if(err){
       console.log("Error in running server");
    }
    console.log("server started");
})