
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose =require('mongoose');

var app = module.exports = express.createServer();

// Configuration
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.configure('production', function(){
  app.use(express.errorHandler());
});


//mongoose setup
//mongoose.connect('mongodb://socrates:h3ml0ck@ds033887.mongolab.com:33887/acropolis');
mongoose.connect("mongodb://logger:l0gg3rp4ss@ds049467.mongolab.com:49467/logger");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;



var LogEntry = new Schema({  
    applicationId: { type: String, required: false },
    clientIP : { type: String, required: false },
    userAgent : { type: String, required: false },
    module: { type: String, required: false },
    level: { type: String, required: true }, 
	message: { type: String, required: true },
    errorName: { type: String, required: false },
    errorMessage: { type: String, required: false },
    dateTime: { type: Date, default: Date.now }
    //dateTime: { type: Date, required: true }
  });

var LogEntryModel = mongoose.model('LogEntry', LogEntry);

// Routes

app.get('/log', function (req, res){
  return LogEntryModel.find(function (err, logs) {
    if (!err) {
      res.render('index.jade', { locals: {
            title: 'Evolution Client Logs',
            logs : logs
            }
        });
    } else {
      return console.log(err);
    }
  });
});

app.post('/log', function (req, res){
  var entry;
  console.log("POST: ");
  console.log(req.body);
  entry = new LogEntryModel({
    applicationId: req.body.applicationId,
    clientIP : req.connection.remoteAddress,
    userAgent : req.body.userAgent,
    level: req.body.level,
	message: req.body.message,
    module: req.body.module,
  });
  entry.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send();
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
