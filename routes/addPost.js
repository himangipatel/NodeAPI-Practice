'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.post('/', function (req, res, next) {
    console.log(req.body)
    addPost(req.body,res)
});

function addPost(body, response) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("FlutterAppAPI");
        var post = {};

        post.title = body.title;
        post.description = body.description;
        post.postedBy = body.postedBy;
        post.createtime=  new Date()

        dbo.collection("posts").insertOne(post, function (err, res) {
            if (err) throw err;

            console.log(res.ops[0]._id);

            response.send(res.ops[0]);

        })
    })
}

module.exports = router;
