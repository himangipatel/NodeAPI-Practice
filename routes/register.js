'use strict';


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.post('/', function (req, res, next) {
    console.log(req.body)
    registerUser(req.body, res)
});

function registerUser(body, response) {
    if (body.name === "") {
        response.send(createTextResponse('Name Required',false));
    } else if (body.email === "") {
        response.send(createTextResponse('Email Required',false));
    } else if (body.password === "") {
        response.send(createTextResponse('Password Required'));
    } else {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db("FlutterAppAPI");
            var user = {};

            user.name = body.name;
            user.email = body.email;
            user.password = body.password;
            user.deviceType = body.deviceType;

            dbo.collection("users").find({ email: user.email }).toArray(function (err, result) {
                if (err) throw err;
                console.log(result.length);
                if (result.length == 0) {
                    dbo.collection("users").insertOne(user, function (err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");

                        response.send(createTextResponse('User Registered',true));
                    });
                } else {
                    response.send(createTextResponse('User already Registered',false));
                }

                db.close();

            });

        });
    }

}

function createTextResponse(textResponse,isSuccess) {
    let response = {
        "message": textResponse,
        "isSuccess":isSuccess
    }
    return response;
}

module.exports = router;
