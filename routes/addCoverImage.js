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
    cb(null, "./uploads/");
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

router.post("/", upload.single("userCoverPhoto"), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  addImageToDB(req, res);
});

function addImageToDB(req, response) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("FlutterAppAPI");
    var userID = req.body.userID;

    var path = req.file.path;
    path = path.replace(/^uploads+/i, "");

    dbo
      .collection("users")
      .findOne({ _id: ObjectId(userID) }, function (err, user) {
        console.log(user);
        if (user.userCoverImage != null) {
          deleteFile('./uploads/' + user.userCoverImage)
        }
        dbo
          .collection("users")
          .updateOne(
            { _id: ObjectId(userID) },
            { $set: { userCoverImage: path } },
            function (err, result) {
              if (err) throw err;
              console.log(result.modifiedCount);
              if (result.modifiedCount == 1) {
                dbo
                  .collection("users")
                  .findOne({ _id: ObjectId(userID) }, function (err, result1) {
                    console.log(result1);
                    let res = {
                      user: result1,
                      message: "Cover image added successfully",
                      isSuccess: true
                    };
                    response.send(res);
                  });
              } else {
                let res = {
                  message: "Failed to upload cover image",
                  isSuccess: false
                };
                response.send(res);
              }
            }
          );

      });


  });
}

function deleteFile(path) {
  try {
    fs.unlinkSync(path)
    //file removed
  } catch (err) {
    console.error(err)
  }
}

module.exports = router;
