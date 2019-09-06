var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var user_schema = new Schema({
    name: String,
    email: String,
    password: String,
    deviceType:String
});

module.exports = mongoose.model('users', user_schema);