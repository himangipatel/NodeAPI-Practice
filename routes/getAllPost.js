'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.get('/', function (req, res, next) {
    console.log(req.body)
    getAllPosts(res)
});

function getAllPosts(response) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("FlutterAppAPI");
       
        dbo.collection("posts").find({}).toArray(function(err,result){
            if(err) throw err;
            console.log(result);
            response.send(result);
        })
    })
}

module.exports = router;
