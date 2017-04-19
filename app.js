var express = require('express');
var app = express();

var fs = require('fs');
var bodyParser = require('body-parser');
var flowParser = require('./flowParser');

var flowdir = "./xmls";
var routedir = "./routes";

app.use('/',express.static('./www'));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/save', function (req, res) {
	var content = unescape(req.body.xml);
	fs.writeFile(flowdir+"/"+req.body.filename, content, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
      flowParser.xml2Route(flowdir+"/"+req.body.filename,routedir+"/"+req.body.filename.match(/^(.*)\.xml/)[1] + "_route.js");
	    res.json({'code':0,'message':'OK'});
	});
});

app.post('/open', function (req, res) {
  //console.log(req);
});


app.listen(3100, function () {
  console.log('Example app listening on port 3100!')
});
