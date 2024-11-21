/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
var path = require('path')
const express = require('express')
const env = require('dotenv').config()
const app = express()
const static = require('./routes/static')
const inventoryRoute = require('./routes/inventoryRoute')
const baseController = require('./controllers/baseController')
const utilities = require('./utilities/')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use('/inv', inventoryRoute)

app.get('/', baseController.buildHome)

/* -----[ Middleware to handling routes not found ]----- */
app.use(async (req, res, next) => next({status: 404, message: 'Sorry, we appear to have lost that page.'}))

/* -----[ Middleware to handling errors ]----- */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  
  console.log('Inside handling errors: ', nav)
  console.log(`Error at: ${req.originalURL}: ${err.message}`)
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
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`---= :: Run APP :: =---`)
})