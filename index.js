
const express = require('express');
const port = process.env.PORT;
const app= express();
const mongoose = require("./config/mongoose");
const User = require('./models/user');
const https = require('https');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('./assets'));
app.set('view engine','ejs');
app.set('views','./views');
var educationArray = [];
var experienceArray=[];
var projectArray=[];
// var id;
var search_id;
var field = "";
var query = "";
var nextRes = "";
var flag = "create";
app.get('/getResume',function(req,res){

  User.findById(search_id,function(err,user){
    return res.render('resume',{
      title:"Resume",
      users:user
    }); 
  })

})
app.post('/',function(req,res){

  var action = req.body.queryResult.action;
  console.log('action: ' + action);
  // console.log('user id' + id);
  if(action =="getName"){
      var name = req.body.queryResult.parameters["namelist"]["given-name"];
      if(name ===  undefined)
        query = req.body.queryResult.parameters["namelist"];
      else
        query = req.body.queryResult.parameters["namelist"]["given-name"];
    if(flag == "add")
    {
      let id;
      let contexts = req.body.queryResult.outputContexts;
      console.log(contexts);
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('updateId')){
            id = JSON.parse(context.parameters.updateId);
            break;
          }
      }
      console.log(id);
        User.findByIdAndUpdate(id, {
            "name": query
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            console.log("updated");
        });
        nextRes = "Resume Updated";
        return res.json(200, {
          "fulfillmentMessages": [
            {
              "platform": "ACTIONS_ON_GOOGLE",
              "simpleResponses": {
                "simpleResponses": [
                  {
                    "textToSpeech": [nextRes]
                  }
                ]
              }
            }
          ]



      });
      
    }else{
        experienceArray=[];
        educationArray = [];
        projectArray=[];
        console.log(query);
        User.create({
          name: query,
          email:"N.A",
          education:[],
          experience:[],
          project:[],
          skills:"N.A",
          interests:"N.A",
          achievements:"N.A"  
        },function(err,user) {
          
          if(err)
          {
              console.log("Error");
              return;
          }
          console.log(" user created \n");
          var id = user._id;
            console.log(id);
            nextRes= "Enter email";
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                }
              ],
          "outputContexts": [
            {
              "name": req.body.session+"/contexts/id",
              "lifespanCount": 5,
              "parameters": {
                "id": JSON.stringify(id)
              }
            }
           ]
          });
          
          
          });
        } 
  
  }
  else if(action=="getEmail"){

  let id;
  if(flag=="create"){

    let contexts = req.body.queryResult.outputContexts;
    for(let i=0;i<contexts.length;i++)
    {
        var context = contexts[i];
        if(context.name.endsWith('id')){
          id = JSON.parse(context.parameters.id);
          break;
        }
    }
  }else{
    let contexts = req.body.queryResult.outputContexts;
    for(let i=0;i<contexts.length;i++)
    {
        var context = contexts[i];
        if(context.name.endsWith('updateId')){
          id = JSON.parse(context.parameters.updateId);
          break;
        }
    }
    

  }
  console.log(id);
  User.findByIdAndUpdate(id,{"email":req.body.queryResult.queryText},function(err,user){
        if(err)
        {
          console.log("cant be update");
          return;
        }
        console.log(id);
        console.log("updated");
        nextRes = "Enter skills"
        if(flag == "add")
        {
          nextRes = "Resume Updated";
        }
        return res.json(200, {
          "fulfillmentMessages": [
            {
              "platform": "ACTIONS_ON_GOOGLE",
              "simpleResponses": {
                "simpleResponses": [
                  {
                    "textToSpeech": [nextRes]
                  }
                ]
              }
            }
          ]
      });
    });

  }
  else if(action=="getSkills"){

    let id;
    if(flag=="create"){
  
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('id')){
            id = JSON.parse(context.parameters.id);
            break;
          }
      }
    }else{
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('updateId')){
            id = JSON.parse(context.parameters.updateId);
            break;
          }
      }
      
  
    }
    console.log(id);

     User.findOne({
      _id: id
     }, function(err, user) {
      if (err) {
          console.log("cant be updated");
          return;
      }
      if (flag == "create")
          query = req.body.queryResult.queryText;
      else if (flag == "add"){
        if(String(user.skills).length == 0)
          query = req.body.queryResult.queryText;
      else
          query = user.skills + ", " + req.body.queryResult.queryText;
      }
      else if (flag == "delete") {
          var main_str = user.skills;
          var str = req.body.queryResult.queryText;
          if(main_str.includes(", " + str))
            query = main_str.replace(", " + str, "");
          else if(main_str.includes(str + ","))
            query = main_str.replace(str + ",", "");
          else
            query = main_str.replace(str, "");
      }
      User.findByIdAndUpdate(id, {
          "skills": query
      }, function(err, user) {
          if (err) {
              console.log("cant be updated");
              return;
          }
          console.log("updated");
      });
      if (flag == "create")
          nextRes = "Enter interests";
      else
          nextRes = "Your resume has been updated";
          return res.json(200, {
            "fulfillmentMessages": [
              {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                  "simpleResponses": [
                    {
                      "textToSpeech": [nextRes]
                    }
                  ]
                }
              }
            ]
        });
  });
  }
  else if(action=="getInterest"){

  
    let id;
    if(flag=="create"){
  
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('id')){
            id = JSON.parse(context.parameters.id);
            break;
          }
      }
    }else{
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('updateId')){
            id = JSON.parse(context.parameters.updateId);
            break;
          }
      }
      
  
    }
    console.log(id);
    
    User.findOne({
      _id: id
   }, function(err, user) {
      if (err) {
          console.log("cant be updated");
          return;
      }
      if (flag == "create")
          query = req.body.queryResult.queryText;
      else if (flag == "add")
      {
        if(String(user.interests).length == 0)
          query = req.body.queryResult.queryText;
        else
          query = user.interests + ", " + req.body.queryResult.queryText;
      }
      else if (flag == "delete") {
          var main_str = user.interests;
          var str = req.body.queryResult.queryText;
          if(main_str.includes(", " + str))
            query = main_str.replace(", " + str, "");
         else if(main_str.includes(str + ","))
            query = main_str.replace(str + ",", "");
         else
            query = main_str.replace(str, "");
          
      }
      User.findByIdAndUpdate(id, {
          "interests": query
      }, function(err, user) {
          if (err) {
              console.log("cant be updated");
              return;
          }
          console.log("updated");
      });
      if (flag == "create")
          nextRes = "Enter education";
      else
          nextRes = "Your resume has been updated";
          return res.json(200, {
            "fulfillmentMessages": [
              {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                  "simpleResponses": [
                    {
                      "textToSpeech": [nextRes]
                    }
                  ]
                }
              }
            ]
        });
  });
       

  }
  else if(action=="getAchievements"){

    let id;
    if(flag=="create"){
  
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('id')){
            id = JSON.parse(context.parameters.id);
            break;
          }
      }
    }else{
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('updateId')){
            id = JSON.parse(context.parameters.updateId);
            break;
          }
      }
      
  
    }
    console.log(id);
  
    User.findOne({
      _id: id
  }, function(err, user) {
      if (err) {
          console.log("cant be updated");
          return;
      }
      if (flag == "create")
           query = req.body.queryResult.queryText;
      else if (flag == "add"){
          if(String(user.achievements).length == 0)
            query = req.body.queryResult.queryText;
          else
            query = user.achievements + ", " + req.body.queryResult.queryText;
      }
      else if (flag == "delete") {
          var main_str = user.achievements;
          var str = req.body.queryResult.queryText;
          if(main_str.includes(", " + str))
            query = main_str.replace(", " + str, "");
          else if(main_str.includes(str + ","))
            query = main_str.replace(str + ",", "");
          else
            query = main_str.replace(str, "");
      }
      User.findByIdAndUpdate(id, {
          "achievements": query
      }, function(err, user) {
          if (err) {
              console.log("cant be updated");
              return;
          }
          console.log("updated");
      });
      if (flag == "create")
          nextRes = "Thank you! Your resume gas been recorded. Please note your id for accessing later. ID : " + id;
      else 
          nextRes = "Your resume has been updated";
          return res.json(200, {
            "fulfillmentMessages": [
              {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                  "simpleResponses": [
                    {
                      "textToSpeech": [nextRes]
                    }
                  ]
                }
              }
            ]
        });

  });

  }
  else if(action=="getProjects"){

    let id;
    if(flag=="create"){
  
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('id')){
            id = JSON.parse(context.parameters.id);
            break;
          }
      }
    }else{
      let contexts = req.body.queryResult.outputContexts;
      for(let i=0;i<contexts.length;i++)
      {
          var context = contexts[i];
          if(context.name.endsWith('updateId')){
            id = JSON.parse(context.parameters.updateId);
            break;
          }
      }
      
  
    }
    console.log(id);

      projectArray = [];
      var title = req.body.queryResult.parameters["title"];
      var year = req.body.queryResult.parameters["year"];
      var description = req.body.queryResult.parameters["description"];
      projectArray.push({
          "title": title,
          "year": year,
          "description": description
      });

      User.findOne({
          _id: id
      }, function(err, user) {
          if (err) {
              console.log("cant be updated");
              return;
          }
          User.findByIdAndUpdate(id, {
              $push: {
                  project: projectArray
              }
          }, function(err, user) {
              if (err) {
                  console.log("cant be updated");
                  return;
              }
              console.log("updated");
          });
          if (flag == "create"){
            nextRes = "Want to enter more?";
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                },
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "suggestions": {
                    "suggestions": [
                      {
                        "title": "yes"
                      },
                      {
                        "title": "no"
                      }
                    ]
                  }
                }
                ]
          });
          }
          else{
              nextRes = "Your resume has been updated";
              return res.json(200, {
                "fulfillmentMessages": [
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                      "simpleResponses": [
                        {
                          "textToSpeech": [nextRes]
                        }
                      ]
                    }
                  }
                ]
            });
          }
        });

  }
  else if(action == "showResume")
  {
    
     search_id = req.body.queryResult.parameters["id"];
     User.findOne({
            _id: search_id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                nextRes = "Enter a valid id";
            }
            else {
                nextRes = "https://resume-fulfilment.herokuapp.com/getResume";
            }
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                }
              ]
          });
        
      });

     
     
  }
  else if(action=="getEducation"){
       
        let id;
        if(flag=="create"){
      
          let contexts = req.body.queryResult.outputContexts;
          for(let i=0;i<contexts.length;i++)
          {
              var context = contexts[i];
              if(context.name.endsWith('id')){
                id = JSON.parse(context.parameters.id);
                break;
              }
          }
        }else{
          let contexts = req.body.queryResult.outputContexts;
          for(let i=0;i<contexts.length;i++)
          {
              var context = contexts[i];
              if(context.name.endsWith('updateId')){
                id = JSON.parse(context.parameters.updateId);
                break;
              }
          }
          
      
        }
        console.log(id);
        educationArray = [];
        var degree = req.body.queryResult.parameters["degree"];
        var university_name = req.body.queryResult.parameters["university_name"];
        var location = req.body.queryResult.parameters["city"];
        var percentage = req.body.queryResult.parameters["percentage"];
        educationArray.push({
            "degree": degree,
            "university_name": university_name,
            "location": location,
            "percentage": percentage
        });
        User.findOne({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            User.findByIdAndUpdate(id, {
                $push: {
                    education: educationArray
                }
            }, function(err, user) {
                if (err) {
                    console.log("cant be updated");
                    return;
                }
                console.log("updated");
            });
            if (flag == "create"){
              nextRes = "Want to enter more?";
              return res.json(200, {
                "fulfillmentMessages": [
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                      "simpleResponses": [
                        {
                          "textToSpeech": [nextRes]
                        }
                      ]
                    }
                  },
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "suggestions": {
                      "suggestions": [
                        {
                          "title": "yes"
                        },
                        {
                          "title": "no"
                        }
                      ]
                    }
                  }
                 ]
            });
          }
          else{
              nextRes = "Your resume has been updated";
              return res.json(200, {
                "fulfillmentMessages": [
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                      "simpleResponses": [
                        {
                          "textToSpeech": [nextRes]
                        }
                      ]
                    }
                  }
                ]
            });
          }
    
        });

  }
  else if(action=="getExperience"){

        let id;
        if(flag=="create"){
      
          let contexts = req.body.queryResult.outputContexts;
          for(let i=0;i<contexts.length;i++)
          {
              var context = contexts[i];
              if(context.name.endsWith('id')){
                id = JSON.parse(context.parameters.id);
                break;
              }
          }
        }else{
          let contexts = req.body.queryResult.outputContexts;
          for(let i=0;i<contexts.length;i++)
          {
              var context = contexts[i];
              if(context.name.endsWith('updateId')){
                id = JSON.parse(context.parameters.updateId);
                break;
              }
          }
          
      
        }
        console.log(id);

         experienceArray = [];
        var position = req.body.queryResult.parameters["position"];
        var duration = req.body.queryResult.parameters["duration"];
        var location = req.body.queryResult.parameters["city"];
        var company_name = req.body.queryResult.parameters["company_name"];
        experienceArray.push({
            "position": position,
            "duration": duration,
            "location": location,
            "company_name": company_name
        });

        User.findOne({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            User.findByIdAndUpdate(id, {
                $push: {
                    experience: experienceArray
                }
            }, function(err, user) {
                if (err) {
                    console.log("cant be updated");
                    return;
                }
                console.log("updated");
            });
            if (flag == "create"){
                nextRes = "Want to enter more?";
                return res.json(200, {
                  "fulfillmentMessages": [
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "simpleResponses": {
                        "simpleResponses": [
                          {
                            "textToSpeech": [nextRes]
                          }
                        ]
                      }
                    },
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "suggestions": {
                        "suggestions": [
                          {
                            "title": "yes"
                          },
                          {
                            "title": "no"
                          }
                        ]
                      }
                    }
                   ]
              });
            }
            else{
                nextRes = "Your resume has been updated";
                return res.json(200, {
                  "fulfillmentMessages": [
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "simpleResponses": {
                        "simpleResponses": [
                          {
                            "textToSpeech": [nextRes]
                          }
                        ]
                      }
                    }
                  ]
              });
            }
        });

  }
  else if(action == "showDetails"){

    var tokenId = req.body.queryResult.parameters["id"];
    console.log(tokenId);
    var details = req.body.queryResult.parameters["details"];
    User.findOne({_id:tokenId},function(err,user){
        var result="";
        if(err){
          result = "Enter a valid ID";
        }
        else{
          if(details == "name")
          {
              result = user.name;
          }
          if(details == "skills")
          {
              result = user.skills;
          }
          else if(details == "interests")
          {
              result = user.interests;
          }
          else if(details == "email")
          {
              result = user.email;
          }
          else if(details == "achievements")
          {
              result = user.achievements;
          }
          else if(details == "education")
          {
              for(var i=0;i<user.education.length;i++)
              {
                  result+= "Degree: "+user.education[i].degree+","+
                  "University_Name"+ user.education[i].university_name+","+
                  "Location"+ user.education[i].location+","+
                  "Percentage: "+user.education[i].percentage
              }
          }
          else if(details == "name")
          {
            result = user.name;
          }
          else if(details == "experience")
          {
            for(var i=0;i<user.experience.length;i++)
              {
                  result+= "Position: "+user.experience[i].position+","+
                  "Duration"+ user.experience[i].duration+","+
                  "Location"+ user.experience[i].location+","+
                  "Company Name: "+user.experience[i].company_name
              }

          }  
          else if(details == "projects")
          {
            for(var i=0;i<user.project.length;i++)
            {
                result+= "Title: "+user.project[i].title+","+
                "Description"+ user.project[i].description+","+
                "Year"+ user.project[i].year+",";
            }
          }  
        }
        return res.json(200, {
          "fulfillmentMessages": [
            {
              "platform": "ACTIONS_ON_GOOGLE",
              "simpleResponses": {
                "simpleResponses": [
                  {
                    "textToSpeech": [result]
                  }
                ]
              }
            }
          ]
      });

    });

  }
  else if (action == "updateResume") {
        var len = 0;
        var toSend = "";
        field = req.body.queryResult.parameters["details"];
        let updateId = req.body.queryResult.parameters["id"];
        User.findOne({
            _id: updateId
        }, function(err, user) {
            if (err) {
                console.log("cant be found");
                toSend = "Enter a valid ID";
                return res.json(200, {
                  "fulfillmentMessages": [
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "simpleResponses": {
                        "simpleResponses": [
                          {
                            "textToSpeech": [toSend]
                          }
                        ]
                      }
                    }]
                  });
            }
            console.log("found");
            if (field == "name"){
                toSend = user.name + " \n Add new?";
                return res.json(200, {
                  "fulfillmentMessages": [
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "simpleResponses": {
                        "simpleResponses": [
                          {
                            "textToSpeech": [toSend]
                          }
                        ]
                      }
                    },
                    {
                      "platform": "ACTIONS_ON_GOOGLE",
                      "suggestions": {
                        "suggestions": [
                          {
                            "title": "add"
                          },
                        ]
                      }
                    } 
                                    
                  ],     
                    "outputContexts": [
                      {
                        "name": req.body.session+"/contexts/updateId",
                        "lifespanCount": 5,
                        "parameters": {
                          "updateId": JSON.stringify(updateId)
                        }
                      }
                    ]
              });
            }
            else if (field == "email")
                {
                  toSend = user.email + " \n Add new?";
                    return res.json(200, {
                      "fulfillmentMessages": [
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "simpleResponses": {
                            "simpleResponses": [
                              {
                                "textToSpeech": [toSend]
                              }
                            ]
                          }
                        },
                        {
                          "platform": "ACTIONS_ON_GOOGLE",
                          "suggestions": {
                            "suggestions": [
                              {
                                "title": "add"
                              },
                            ]
                          }
                        }                 
                      ],
                       
                    "outputContexts": [
                      {
                        "name": req.body.session+"/contexts/updateId",
                        "lifespanCount": 5,
                        "parameters": {
                          "updateId": JSON.stringify(updateId)
                        }
                      }
                    ]
                  });
                }
            else if (field == "skills")
                toSend = user.skills + "\n Delete or add new?";
            else if (field == "interests")
                toSend = user.interests + "\n Delete or add new?";
            else if (field == "education") {
                toSend = "";
                len = user.education.length;
                for (i = 0; i < len; i++)
                    toSend += (i + 1).toString() + " Degree: " + String(user.education[i].degree) + " School Name: " + String(user.education[i].university_name) + " Location: " + String(user.education[i].location) + " Percentage: " + String(user.education[i].percentage) + "\n";
                toSend += "\n Delete some entry or add new?";
            } else if (field == "projects") {
                toSend = "";
                len = user.project.length;
                for (i = 0; i < len; i++)
                    toSend += (i + 1).toString() + " Title: " + String(user.project[i].title) + " Year: " + String(user.project[i].year) + " Description: " + String(user.project[i].description) + "\n";
                toSend += "\n Delete some entry or add new?";
            } else if (field == "experience") {
                toSend = "";
                len = user.experience.length;
                for (i = 0; i < len; i++)
                    toSend += (i + 1).toString() + " Position: " + String(user.experience[i].position) + " Company: " + String(user.experience[i].company_name) + " Location: " + String(user.experience[i].location) + " Duration: " + String(user.experience[i].duration) + "\n";
                toSend += "\n Delete some entry or add new?"
            } else if (field == "achievements")
                toSend = user.achievements + "\n Delete all or add new?";
            else
                toSend = "Not a valid query";

            return res.json(200, {
                "fulfillmentMessages": [
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                      "simpleResponses": [
                        {
                          "textToSpeech": [toSend]
                        }
                      ]
                    }
                  },
                  {
                    "platform": "ACTIONS_ON_GOOGLE",
                    "suggestions": {
                      "suggestions": [
                        {
                          "title": "add"
                        },
                        {
                          "title": "delete"
                        }
                      ]
                    }
                  }                 
                ],
                "outputContexts": [
                  {
                    "name": req.body.session+"/contexts/updateId",
                    "lifespanCount": 5,
                    "parameters": {
                      "updateId": JSON.stringify(updateId)
                    }
                  }
                ]
            });
        });

} else if (action == "modifyAction") {
    var toSend = "";
    var val = req.body.queryResult.queryText;
    if (val == "add") {
        flag = "add";
        toSend = "Enter " + field;
    } else if (val == "delete") {
        flag = "delete";
        if (field == "skills") {
            toSend = "Enter skill to be deleted";
        } else if (field == "interests") {
            toSend = "Enter interest to be deleted";
        } else if (field == "achievements") {
            toSend = "Enter achievement to be deleted";
        } else if (field == "education") {
            toSend = "Enter record index to be deleted";

        } else if (field == "projects") {
            toSend = "Enter record index to be deleted";

        } else if (field == "experience") {
            toSend = "Enter record index to be deleted";

        }
    } else
        toSend = "Invalid Request";
        return res.json(200, {
          "fulfillmentMessages": [
            {
              "platform": "ACTIONS_ON_GOOGLE",
              "simpleResponses": {
                "simpleResponses": [
                  {
                    "textToSpeech": [toSend]
                  }
                ]
              }
            }
          ]
      });
} else if (action == "getIndex") {
    var index = req.body.queryResult.parameters["number"];
    let id;
    let contexts = req.body.queryResult.outputContexts;
    for(let i=0;i<contexts.length;i++)
    {
        var context = contexts[i];
        if(context.name.endsWith('updateId')){
          id = JSON.parse(context.parameters.updateId);
          break;
        }
    }
    console.log(id);
    if (field == "education") {
        User.findOne({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            var array = user.education;
            array.splice(index - 1, 1);
            User.findByIdAndUpdate(id, {
                education: array
            }, function(err, user) {
                if (err) {
                    console.log("cant be updated");
                    return;
                }
                console.log("updated");
            });
            nextRes = "Your resume has been updated";
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                }
              ]
          });
        });
    } else if (field == "projects") {
        User.findOne({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            var array = user.project;
            array.splice(index - 1, 1);
            User.findByIdAndUpdate(id, {
                project: array
            }, function(err, user) {
                if (err) {
                    console.log("cant be updated");
                    return;
                }
                console.log("updated");
            });
            nextRes = "Your resume has been updated";
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                }
              ]
          });
        });
    } else if (field == "experience") {
        User.findOne({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            var array = user.experience;
            array.splice(index - 1, 1);
            User.findByIdAndUpdate(id, {
                experience: array
            }, function(err, user) {
                if (err) {
                    console.log("cant be updated");
                    return;
                }
                console.log("updated");
            });
            nextRes = "Your resume has been updated";
            return res.json(200, {
              "fulfillmentMessages": [
                {
                  "platform": "ACTIONS_ON_GOOGLE",
                  "simpleResponses": {
                    "simpleResponses": [
                      {
                        "textToSpeech": [nextRes]
                      }
                    ]
                  }
                }
              ]
          });
        });
    }
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
      var toSend = result + " Want to create resume?";
      return res.json(200, {
        "fulfillmentMessages": [
          {
            "platform": "ACTIONS_ON_GOOGLE",
            "simpleResponses": {
              "simpleResponses": [
                {
                  "textToSpeech": [toSend]
                }
              ]
            }
          },
          {
            "platform": "ACTIONS_ON_GOOGLE",
            "suggestions": {
              "suggestions": [
                {
                  "title": "yes"
                },
                {
                  "title": "no"
                }
              ]
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