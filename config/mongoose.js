//require the library
const mongoose = require('mongoose');


mongoose.connect(`mongodb://localhost/skillsdb`);
//aqcuire the connection
const db = mongoose.connection;
//error
db.on('error',console.error.bind(console,'error connectiveity to db'));
//up and running tehn  print the message
db.once('open',function(){
    console.log("Successfully connected to db");
});
module.exports= db;
