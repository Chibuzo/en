const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authenticate = require('./middlewares/authenticate');
const formatView = require('./middlewares/formatView');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const puRoutes = require('./routes/pu');
const wardRoutes = require('./routes/ward');
const lgRoutes = require('./routes/lg');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767tobechangedbeforegoinglive",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // one fucking day
    resave: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(formatView);
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/pu', puRoutes);
app.use('/ward', wardRoutes);
app.use('/lg', lgRoutes);

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
});

module.exports = app;
