/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
var path = require('path')
const express = require('express')
const app = express()
const static = require('./routes/static')
const inventoryRoute = require('./routes/inventoryRoute')
const baseController = require('./controllers/baseController')
const utilities = require('./utilities/')
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require('body-parser')

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use('/inventory', inventoryRoute)
app.use('/inventory', require('./routes/classificationRoute'))
app.use('/account', require('./routes/accountRoute'))
app.get('/', baseController.buildHome)

/* -----[ Middleware to handling routes not found ]----- */
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* -----[ Middleware to handling errors ]----- */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()

  res.render('errors/error', {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`---= :: Running APP :: =---`)
})