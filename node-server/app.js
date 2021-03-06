const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');

const index = require('./controllers/index');
const triggerCrawl = require('./controllers/trigger-crawl');
const jsFile = require('./controllers/js-file');
const clearCrawl = require('./controllers/clear-crawl');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
console.log(app.get('views'));

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/script', jsFile);
app.use('/', index);
app.use('/trigger-crawl', triggerCrawl);
app.use('/clear-crawl', clearCrawl);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    console.log(err.message);
});

require('./business_layer/schedule');

module.exports = app;
