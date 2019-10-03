'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";
var ObjectId = require('mongodb').ObjectID;


router.get('/', function (req, res, next) {
    console.log(req.body)
    getAllPosts(res)
});

function getAllPosts(response) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("FlutterAppAPI");

        // dbo.collection("posts").find({}).toArray(function (err, result) {
        //     if (err) throw err;
        //     console.log(result);
        //     response.send(result);
        // })

        dbo.collection("posts").aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "user"
                }
            }
        ]).toArray(function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
            response.send(JSON.stringify(res));
            db.close();
          });

    })
}

module.exports = router;
