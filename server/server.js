var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 9090 });

var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    protectedRoutes = require('./protected-routes')(wss);

var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

app.use(require('./anonymous-routes'));
app.use(protectedRoutes);
app.use(require('./user-routes'));

var port = process.env.PORT || 8001;

// REGISTER OUR ROUTES -------------------------------
app.use('/api', protectedRoutes);

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

