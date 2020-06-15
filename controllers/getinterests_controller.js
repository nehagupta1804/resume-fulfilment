const User = require('../models/user');
module.exports.getInterests = function(req,res)
{
    let flag, nextRes, query;
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
    let found = 1;
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

    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            console.log("cant be updated");
            return;
        }
        if (flag == "create")
            query = req.body.queryResult.queryText;
        else if (flag == "add") {
            if (String(user.interests).length == 0)
                query = req.body.queryResult.queryText;
            else
                query = user.interests + "," + req.body.queryResult.queryText;
        } else if (flag == "delete") {
            var main_str = user.interests;
            var str = req.body.queryResult.queryText;
            main_str = main_str.toLowerCase();
            str = str.toLowerCase();
            if (main_str.includes("," + str))
                query = main_str.replace("," + str, "");
            else if (main_str.includes(str + ","))
                query = main_str.replace(str + ",", "");
            else if(main_str.includes(str))
                query = main_str.replace(str, "");
            else{
                query = main_str;
                found = 0;
            }

        }
        User.findByIdAndUpdate(id, {
            "interests": query
        }, function(err, user) {
            if (err) {
                console.log("cant be updated");
                return;
            }
            console.log("updated");
            if (flag == "create"){
                nextRes = "Please enter education \n Example: I studied B.Tech in Computer Science from IIT in Delhi with 82%";
                return res.json(200, {
                  "fulfillmentMessages": [{
                      "platform": "ACTIONS_ON_GOOGLE",
                      "simpleResponses": {
                          "simpleResponses": [{
                              "textToSpeech": [nextRes]
                          }]
                      }
                  }]
              });
            }
            else if (flag == "add")
                nextRes = "Resume Updated";
            else if (flag == "delete" && found == 1)
                nextRes = "Resume Updated";
            else
                nextRes = "Interest not found."
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
        });
    });

}