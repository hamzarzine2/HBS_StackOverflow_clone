const express = require('express');

const createError = require('http-errors');
const path = require('path');

const session = require('express-session')
const logger = require('morgan');

// TODO Rename config.example.js to config.js and change your secret
// Then uncomment the following line 
// const config = require('./config');


// TODO Require your controllers here
var indexRouter = require('./routes/index');
var questionsRouter = require('./routes/questions');
var usersRouteur = require('./routes/users');


const app = express();
const port = 3000;

//for partials view
var hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');
// Setup views folder and handlebar engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev')); // Log each request
app.use(express.urlencoded({ extended: false })); // Decode form values
app.use(express.static(path.join(__dirname, 'public'))); // Get static files from public folder

//for sessions
app.use(session({secret: "Your secret key", resave: false, saveUninitialized:false}));

app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

app.use('/',indexRouter )
app.use('/questions',questionsRouter)
app.use('/users',usersRouteur)
// Uncomment the following line when you have setup the config file
//app.use(session({ secret: config.secret, resave: false, saveUninitialized: false }))


// TODO Call your controllers here


// Create error on page not found
app.use((req, res, next) => next(createError(404)) ); 

// Show error hbs page
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', { error });
});

// Launch server
app.listen(port, () => console.log('App listening on port ' + port) );
