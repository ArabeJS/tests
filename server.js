var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var fs = require('fs');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var options = {
  method: 'POST',
  url: 'http://thgss.com/index.php?p=download3',
  qs: {
    p: 'download3'
  },
  headers: {
    'postman-token': 'ed4b48ee-0ae6-596d-8d4f-0b15f79eff0f',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    done: 'true'
  }
};

var html = `
<!DOCTYPE html>
<html ng-app="RDapp" ng-controller="RDapp" lang="en" dir="ltr" >
  <head>
    <meta charset="utf-8">
    <title>GO</title>
  </head>
  <body>
    Raafet
    <br>
    <br>
    <br>
    <br>
    <button type="button" name="button" ng-hide="btn" ng-click="up()">Update</button>
    <span ng-hide="msg">Server is Update! :)</span>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
    <script type="text/javascript">
      var RD = angular.module('RDapp', []);
      RD.controller('RDapp', function($scope, $http) {
        $scope.btn = false;
        $scope.msg = true;

        $scope.up = function () {
          var settings = {"headers": {"content-type": "application/x-www-form-urlencoded"}};
          var turl = 'http://thgss.com/index.php?p=download3';
          $http.post(turl, $.param({'done': true}), settings)
          .then(function(data) {
            $http.post('http://iptv.raafet.ga/api', $.param({'data': data}), settings)
            .then(function(data) {
              console.log(data);
              $scope.btn = true;
              $scope.msg = false;
            }, function (error) {
              console.log(error);
            });
          }, function (error) {
            console.log(error);
          });
        };
      });
    </script>
  </body>
</html>
`;



// routes will go here
app.get('/', function(req, res) {
  res.send(html);
});


app.get('/rd.m3u', function(req, res) {
  fs.readFile('data.txt', function(err, data) {
    res.set('Content-Type', 'application/octet-stream');
    res.send(data);
  });
});



app.post('/api', function(req, res) {
  var data = req.body.data;
  fs.appendFile('data.txt', data, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
