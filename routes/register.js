var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/FlutterAppAPI";
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
    //  || file.mimetype === "video/mp4"
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

// https://www.youtube.com/watch?v=srPXMt1Q0nY

router.post("/", upload.single("userImage"), function(req, res, next) {
  console.log(req.body);
  console.log(req.file)
  handleRegistration(req, res);
});

// router.post("/",  function(req, res, next) {
//   handleRegistration(req, res);
// });

function handleRegistration(req, response) {
  console.log(req.body);
  if (req.body.loginType === "email-password") {
    registerUser(req, response);
  } else if (req.body.loginType === "google-signin") {
    registerGoogleUser(req.body, response);
  }
}

function registerUser(req, response) {
  if (req.body.name === "") {
    response.send(createTextResponse("Name Required", false));
  } else if (req.body.email === "") {
    response.send(createTextResponse("Email Required", false));
  } else if (req.body.password === "") {
    response.send(createTextResponse("Password Required"));
  } else {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;

      var dbo = db.db("FlutterAppAPI");
      var user = {};

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.deviceType = req.body.deviceType;
      user.loginType = req.body.loginType;

      var path = req.file.path;
      path = path.replace(/^uploads+/i,'')
      user.photo = path;
      user.mobile = req.body.mobile;
      user.department = req.body.department;
      user.gender = req.body.gender;
    

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
                user: res.ops[0],
                message: "User Registered",
                isSuccess: true
              };

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
          console.log(result);
          dbo.collection("users").insertOne(user, function(err, res) {
            if (err) throw err;
            console.log(res.ops[0]);

            let ress = {
              user: res.ops[0],
              message: "User Registered",
              isSuccess: true
            };

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
