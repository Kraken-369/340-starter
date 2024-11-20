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
const baseController = require('./controllers/baseController')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/* ***********************
 * Routes
 *************************/
app.use(static)

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

// Index route
// app.get('/', function(req, res) {
//   res.render('index', {title: 'CSE Motor'})
// })

app.get('/', baseController.buildHome)