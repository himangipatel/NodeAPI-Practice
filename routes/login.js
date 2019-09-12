"use strict";

var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";

router.post("/", function(req, res, next) {
  console.log(req.body);
  handleLoginRequest(req.body, res);
});

function handleLoginRequest(body, response) {
  if (body.loginType == "email-password") {
    checkIsUserLogin(body, response);
  } else if (body.loginType == "google-signin") {
    checkIsGoogleUserLogin(body, response);
  }
}

function checkIsUserLogin(body, response) {
  if (body.email === "") {
    response.send(createTextResponse("Email Required", false));
  } else if (body.password === "") {
    response.send(createTextResponse("Password Required"));
  } else {
    MongoClient.connect(url, function(err, client) {
      if (err) throw err;

      var db = client.db("FlutterAppAPI");
      var user = {};

      user.name = body.name;
      user.email = body.email;
      user.password = body.password;
      user.deviceType = body.deviceType;

      db.collection("users").findOne(
        { email: user.email, password: user.password },
        function(err, result) {
          if (err) throw err;
          console.log(result);
          if (result != null) {
            //login successfull
            let res = {
             user:{
              userID: result._id,
              userName: result.name,
              userEmail: result.email,
             },
              message: "Login Successfullly",
              isSuccess: true
            };
            response.send(res);
          } else {
            console.log(user.email);
            db.collection("users").findOne({ email: user.email }, function(
              err,
              result
            ) {
              if (err) throw err;
              console.log(result);
              if (result != null) {
                //passsword not match
                response.send(createTextResponse("Password mismatch"));
              } else {
                //user not register in system
                response.send(
                  createTextResponse("Email is not register with system")
                );
              }
            });
          }

          client.close();
        }
      );
    });
  }
}

function checkIsGoogleUserLogin(body, response) {
  MongoClient.connect(url, function(err, client) {
    if (err) throw err;

    var db = client.db("FlutterAppAPI");
    var user = {};

    user.googleID = body.googleID;

    db.collection("users").findOne({ googleID: user.googleID }, function(
      err,
      result
    ) {
      if (err) throw err;
      console.log(result);
      if (result != null) {
        //login successfull
        let res = {
          user: {
            userID: result._id,
            userName: result.name,
            userEmail: result.email,
            googleID: result.googleID
          },
          message: "Login Successfullly",
          isSuccess: true
        };
        response.send(res);
      } else {
        console.log(user.email);
        response.send(createTextResponse("User is not register with us"));
      }

      client.close();
    });
  });
}

function createLoginResponse(userID, textResponse, isSuccess) {
  let response = {
    userID: userID,
    message: textResponse,
    isSuccess: isSuccess
  };
  return response;
}

function createTextResponse(textResponse, isSuccess) {
  let response = {
    message: textResponse,
    isSuccess: isSuccess
  };
  return response;
}

module.exports = router;
