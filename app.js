var express = require('express');
var app = express();

var fs = require('fs');
var bodyParser = require('body-parser');


app.use('/',express.static('./www'));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/save', function (req, res) {
	var content = unescape(req.body.xml);
	fs.writeFile(req.body.filename, content, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	    res.json({'code':0,'message':'OK'});
	}); 
});

app.post('/open', function (req, res) {
  console.log(req);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
