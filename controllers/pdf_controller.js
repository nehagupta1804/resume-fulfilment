const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
var app = express();
global.createPDFFile = function (htmlString, fileName, callback) {
    var options = {
        format: 'Letter',
       
    };
    /**
     * It will create PDF of that HTML into given folder.
     */ 
    pdf.create(htmlString, options).toFile('../public/pdf/' + fileName, function (err, data) {
        if (err) return console.log(err);
        return callback(null, config.get('AdminBaseURL') + ':' +
             config.get('app.port') + '/pdf/' + fileName)
      });
}
var contents = fs.readFileSync('../views/resume.ejs', 'utf8');


global.createPDFFile(contents,'resume.pdf', function (err, result) {
    if (err) {
          console.log(err);
      } else { 
          console.log("PDF URL ADDED.");
          console.log(result);
      }
   });
