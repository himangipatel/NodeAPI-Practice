'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.get('/', function (req, res, next) {
    console.log(req.body)
    handleGetCategoriesRequest(req.body, res)
});

function handleGetCategoriesRequest(body, response) {
    console.log(body)
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("FlutterAppAPI");
        dbo.collection("categories").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          response.send(result);
          client.close();
        });
      });
}

module.exports = router;
