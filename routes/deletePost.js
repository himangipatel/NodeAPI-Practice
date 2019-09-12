'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";
var ObjectId = require('mongodb').ObjectID;


router.delete('/', function (req, res, next) {
    console.log(req.query._id)
    deletePost(req.query._id, res)
});

function deletePost(_id, response) {
    MongoClient.connect(url, function (err, db) {
        if (err){
            console.log(err)
        }

        var dbo = db.db("FlutterAppAPI");
    
        dbo.collection("posts").deleteOne({"_id": ObjectId(_id)}, function (err, result) {
            if(err) throw err;
            console.log(result);
            if(result.deletedCount==1){
                response.send({"message":"Post has been successfully deleted"})
            }else{
                response.send({"message":"There is no post to delete"})
            }
           
        })
    })
}

module.exports = router;
