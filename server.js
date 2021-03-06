var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

// routes will go here
app.get('/add/:id', function(req, res) {
  var data = req.params.id;
  
  fs.writeFile('data.txt', data, (err) => {
    if (err) res.send(err);
    res.send("<center><h2>✔ The Key was succesfully saved!<h2></center>");
  }); 

});

// routes will go here
app.post('/addUrl', function(req, res) {
  var data = req.body.url;
  
  fs.writeFile('dataUrl.txt', data, (err) => {
    if (err) res.send(err);
    res.send("<center><h2>✔ The URL was succesfully saved!<h2></center>");
  }); 

});

app.get('/', function(req, res) {
  res.send('Welcome!');
});


app.get('/rd.m3u', function(req, res) {
  fs.readFile('data.txt', function(err, data) {
    var url = "http://24.thgss.com:8000/get.php?username="+data+"&password="+data+"&type=m3u&output=mpegts";
    res.redirect(url);
  });
});

app.get('/rdu.m3u', function(req, res) {
  fs.readFile('dataUrl.txt', function(err, data) {
    var url = data;
    res.redirect(url);
  });
});




// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
