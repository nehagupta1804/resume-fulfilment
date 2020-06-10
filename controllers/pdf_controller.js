const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const express = require('express');
const path = require('path');
var app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
function createPDFFile(htmlString, fileName, callback) {
    var options = {
        format: 'Letter',
       
    };
    /**
     * It will create PDF of that HTML into given folder.
     */ 
    pdf.create(htmlString, options).toFile('../public/pdf/' + fileName, function (err, data) {
        if (err) return console.log(err);
        console.log(data);
        
      });
}
var contents = fs.readFileSync('resume.ejs', 'utf8');
var html = ejs.render(contents, {data: 'some data'});

createPDFFile(html,'resume.pdf', function (err, result) {
    if (err) {
          console.log(err);
      } else { 
          console.log("PDF URL ADDED.");
          console.log(result);
      }
   });
