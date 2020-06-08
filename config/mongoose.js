//require the library
const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://gupta.renu2311@gmail.com:abcd1234@cluster0-m6hmg.mongodb.net/chatbot?retryWrites=true&w=majority`);
//aqcuire the connection
const db = mongoose.connection;
//error
db.on('error',console.error.bind(console,'error connectiveity to db'));
//up and running tehn  print the message
db.once('open',function(){
    console.log("Successfully connected to db");
});
module.exports= db;
