var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.post("/", function(req, res, next) {
  handleRegistration(req.body, res);
});

function handleRegistration(body, response) {
  console.log(body)
  if (body.loginType === "email-password") {
    registerUser(body, response);
  } else if (body.loginType === "google-signin") {
    registerGoogleUser(body, response);
  }
}

function registerUser(body, response) {
  if (body.name === "") {
    response.send(createTextResponse("Name Required", false));
  } else if (body.email === "") {
    response.send(createTextResponse("Email Required", false));
  } else if (body.password === "") {
    response.send(createTextResponse("Password Required"));
  } else {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;

      var dbo = db.db("FlutterAppAPI");
      var user = {};

      user.name = body.name;
      user.email = body.email;
      user.password = body.password;
      user.deviceType = body.deviceType;
      user.loginType = body.loginType;

      dbo
        .collection("users")
        .find({ email: user.email })
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result.length);
          if (result.length == 0) {
           
            dbo.collection("users").insertOne(user, function(err, res) {
              if (err) throw err;
              console.log(res.ops[0]);

              let ress = {
                user:res.ops[0],
                message:"User Registered",
                isSuccess: true
              }

              response.send(ress);
            });
          } else {
            response.send(createTextResponse("User already Registered", false));
          }

          db.close();
        });
    });
  }
}

function registerGoogleUser(body, response) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("FlutterAppAPI");
    var user = {};

    user.photo = body.photo;
    user.email = body.email;
    user.deviceType = body.deviceType;
    user.loginType = body.loginType;
    user.googleID = body.googleID;
    user.name = body.name;

    dbo
      .collection("users")
      .find({ googleID: user.googleID })
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length == 0) {
          console.log(result)
          dbo.collection("users").insertOne(user, function(err, res) {
            if (err) throw err;
            console.log(res.ops[0]);

              let ress = {
                user:res.ops[0],
                message:"User Registered",
                isSuccess: true
              }

              response.send(ress);
          });
        } else {
          response.send(createTextResponse("Email already Registered", false));
        }

        db.close();
      });
  });
}

function createTextResponse(textResponse, isSuccess) {
  let response = {
    message: textResponse,
    isSuccess: isSuccess
  };
  return response;
}

module.exports = router;
