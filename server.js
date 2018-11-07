var express = require('express');
var request = require("request");
var fs = require('fs');

var app = express();
var port = process.env.PORT || 8080;

var options = {
  method: 'POST',
  url: 'http://thgss.com/index.php',
  json: true,
  qs: {
    p: 'download3'
  },
  headers: {
    'postman-token': '22188674-3fb1-72c8-0ae4-f51868dcc07b',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    done: 'true'
  }
};


// routes will go here
app.get('/api', function(req, res) {
  var user_id = req.param('id');

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    res.redirect(response.headers.location);//application/octet-stream
    console.log(response.headers.location);
  });

});
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
