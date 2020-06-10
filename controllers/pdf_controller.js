// const ejs = require('ejs');
// const fs = require('fs');
// const pdf = require('html-pdf');
// const express = require('express');
// const path = require('path');
// var app = express();
// app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'));
// function createPDFFile(htmlString, fileName, callback) {
//     var options = {
//         format: 'Letter',
       
//     };
//     /**
//      * It will create PDF of that HTML into given folder.
//      */ 
//     pdf.create(htmlString, options).toFile('../public/pdf/' + fileName, function (err, data) {
//         if (err) return console.log(err);
//         console.log(data);
        
//       });
// }
// // var contents = fs.readFileSync('resume.ejs', 'utf8');
// var html = ejs.render('resume.ejs', {data: 'some data'});

// createPDFFile(html,'resume.pdf', function (err, result) {
//     if (err) {
//           console.log(err);
//       } else { 
//           console.log("PDF URL ADDED.");
//           console.log(result);
//       }
//    });
var pdf = require("pdf-creator-node");
var fs = require('fs');

var html = fs.readFileSync('../views/resume.html', 'utf8');

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    footer: {
        "height": "28mm",
        "contents": {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page'
    }
}

}

var document = {
    html: html,
    data: {
        users: users
    },
    path: "../public/pdf/output.pdf"
};

pdf.create(document, options)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    });