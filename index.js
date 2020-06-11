
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
var id;
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
  console.log('user id' + id);
  if(action =="getName"){

    if(flag == "add")
    {
        query = req.body.queryResult.queryText;
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
          "fulfillmentMessages": [{
              "text": {
                  "text": [nextRes]
              }
          }]

      });
      
    }else{
      experienceArray=[];
      educationArray = [];
      projectArray=[];
        User.create({
          name:req.body.queryResult.queryText,
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
          id = user._id;
            console.log(id);
            nextRes= "Enter email";
            return res.json(200, {
              "fulfillmentMessages": [{
                  "text": {
                      "text": [nextRes]
                  }
              }]

          });
          
          
          });
      }
          
    
  
  }
  else if(action=="getEmail"){

    console.log(id);
    User.findByIdAndUpdate(id,{"email":req.body.queryResult.queryText},function(err,user)
        {
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
           return res.json(200,
            {
              "fulfillmentMessages": [
                {
                  "text": {
                    "text": [nextRes]
                  }
                }
              ]
                
            });
        });

  }
  else if(action=="getSkills"){

    
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
          query = user.skills + ", " + req.body.queryResult.queryText;
      else if (flag == "delete") {
          var main_str = user.skills;
          var str = req.body.queryResult.queryText;
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
          "fulfillmentMessages": [{
              "text": {
                  "text": [nextRes]
              }
          }]

      });
  });


  }
  else if(action=="getInterest"){


    
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
          query = user.interests + ", " + req.body.queryResult.queryText;
      else if (flag == "delete") {
          var main_str = user.interests;
          var str = req.body.queryResult.queryText;
          query = main_str.replace(str, "");
          query = main_str.replaceAll(", $", "");
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
          nextRes = "Enter experience";
      else
          nextRes = "Your resume has been updated";
      return res.json(200, {
          "fulfillmentMessages": [{
              "text": {
                  "text": [nextRes]
              }
          }]

      });
  });
       

  }
  else if(action=="getAchievements"){


    
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
          query = user.achievements + ", " + req.body.queryResult.queryText;
      else if (flag == "delete") {
          var main_str = user.achievements;
          var str = req.body.queryResult.queryText;
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
          "fulfillmentMessages": [{
              "text": {
                  "text": [nextRes]
              }
          }]
      });

  });

  }
  else if(action=="getProjects"){

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
            if (flag == "create")
                nextRes = "Want to enter more?";
            else
                nextRes = "Your resume has been updated";
            return res.json(200, {
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]

            });
        });

  }
  else if(action == "showResume")
  {
     search_id = req.body.queryResult.parameters["id"];
     return res.json(200,
      {
        "fulfillmentMessages": [
          {
            "text": {
              "text": ["https://resume-fulfilment.herokuapp.com/getResume"]
            }
          }
        ]
          
      });

     
  }
  else if(action=="getEducation"){
      
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
            if (flag == "create")
                nextRes = "Want to enter more?";
            else
                nextRes = "Your resume has been updated";
            return res.json(200, {
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]

            });
        });

  }
  else if(action=="getExperience"){


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
            if (flag == "create")
                nextRes = "Want to enter more?";
            else
                nextRes = "Your resume has been updated";
            return res.json(200, {
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]

            });
        });

  }
  else if(action == "showDetails"){

    var tokenId = req.body.queryResult.parameters["id"];
    var details = req.body.queryResult.parameters["details"];
    User.findOne({_id:tokenId},function(err,user){
        var result="";
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

  }
  else if (action == "updateResume") {
    var len = 0;
    var toSend = "";
    field = req.body.queryResult.parameters["details"];
    id = req.body.queryResult.parameters["id"];
    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            console.log("cant be found");
            return;
        }
        console.log("found");
        if (field == "name")
           toSend = user.name + " \n Add new?";
        else if (field == "email")
           toSend = user.email + " \n Add new?";
        else if (field == "skills")
            toSend = user.skills + "\n Delete all or add new?";
        else if (field == "interests")
            toSend = user.interests + "\n Delete all or add new?";
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
            "fulfillmentMessages": [{
                "text": {
                    "text": [String(toSend)]
                }
            }]

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
        "fulfillmentMessages": [{
            "text": {
                "text": [String(toSend)]
            }
        }]

    });
} else if (action == "getIndex") {
    var index = req.body.queryResult.parameters["number"];
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
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]
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
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]
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
                "fulfillmentMessages": [{
                    "text": {
                        "text": [nextRes]
                    }
                }]
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