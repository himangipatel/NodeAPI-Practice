var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register')
var loginRouter = require('./routes/login')
var getCategoriesRouter = require('./routes/getCategories')
var getPostsRouter = require('./routes/getAllPost')
var deletePostRouter = require('./routes/deletePost')
var addCoverImageRouter = require('./routes/addCoverImage')
var createPostRouter = require('./routes/createPost')

var cors = require('./cors')


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static('uploads'))
app.use(express.static('post'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors)
app.use('/', indexRouter);
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/getCategories', getCategoriesRouter)
app.use('/getPosts', getPostsRouter)
app.use('/deletePost', deletePostRouter)
app.use('/addCoverImage', addCoverImageRouter)
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/createPost',createPostRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err)
});

module.exports = app;