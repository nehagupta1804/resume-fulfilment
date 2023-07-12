const User = require('../models/user');
module.exports.getEducation = function(req,res)
{
    let flag, nextRes;
    let contexts = req.body.queryResult.outputContexts;
    console.log(contexts);
    for (let i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        if (context.name.endsWith('flag')) {
            flag = context.parameters.flag;
            break;
        }
    }
    console.log(flag);

    let id;
    if (flag == "create") {

        let contexts = req.body.queryResult.outputContexts;
        for (let i = 0; i < contexts.length; i++) {
            var context = contexts[i];
            if (context.name.endsWith('id')) {
                id = JSON.parse(context.parameters.id);
                break;
            }
        }
    } else {
        let contexts = req.body.queryResult.outputContexts;
        for (let i = 0; i < contexts.length; i++) {
            var context = contexts[i];
            if (context.name.endsWith('updateid')) {
                id = context.parameters.updateid;
                break;
            }
        }


    }
    console.log(id);
    let educationArray = [];
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
        if (flag == "create") {
            nextRes = "Do you want to enter more?";
            return res.json(200, {
                "fulfillmentMessages": [{
                        "platform": "ACTIONS_ON_GOOGLE",
                        "simpleResponses": {
                            "simpleResponses": [{
                                "textToSpeech": [nextRes]
                            }]
                        }
                    },
                    {
                        "platform": "ACTIONS_ON_GOOGLE",
                        "suggestions": {
                            "suggestions": [{
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
        } else {
            nextRes = "Resume Updated";
            return res.json(200, {
                "fulfillmentMessages": [{
                    "platform": "ACTIONS_ON_GOOGLE",
                    "simpleResponses": {
                        "simpleResponses": [{
                            "textToSpeech": [nextRes]
                        }]
                    }
                }],
                "outputContexts": [{
                  "name": req.body.session + "/contexts/flag",
                  "lifespanCount": 5,
                  "parameters": {
                      "flag": "create"
                  }
              }]
            });
        }

    });
}