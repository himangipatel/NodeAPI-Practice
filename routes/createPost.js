'use strict'

var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";
const multer = require("multer");
var ObjectId = require("mongodb").ObjectID;
const fs = require('fs')
// const path = './uploads/5d919acb4a6ce62cea29ec3a.jpg'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/post/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
});

router.post("/", upload.array("postImages", 5), function (req, res, next) {
    addPost(req, res)
});


function addPost(req, response) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("FlutterAppAPI");
        var post = {};

        console.log(req.body);

        post.description = req.body.description;
        post.postedBy = ObjectId(req.body.postedBy);
        post.createtime = new Date()
        var images = [
        ];

        console.log(req.files[0].path);

        for (var i = 0; i < req.files.length; i++) {
            var path =req.files[i].path;
            path = path.replace(/^uploads+/i,'')
            images.push(path)
        }

        post.images = images;

    
        dbo.collection("posts").insertOne(post, function (err, result) {
            if (err) throw err;
            response.send(result.ops[0]);

        })
    })
}



module.exports = router;
