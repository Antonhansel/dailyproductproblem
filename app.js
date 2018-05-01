const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose')

let isProduction = process.env.NODE_ENV === 'production'

process.on('unhandledRejection', (r) => console.log(r))

// Create global app object
let app = express()

require('dotenv').config()

app.use(cors())

// Normal express config defaults
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ 'extended': false }))
app.use(bodyParser.json())

app.use(require('method-override')())
app.use(express.static(`${__dirname}/public`))

app.use(session({ 'secret': 'babel', 'cookie': { 'maxAge': 60000 }, 'resave': false, 'saveUninitialized': false }))

if (!isProduction) {
  app.use(errorhandler())
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect('mongodb://localhost/dailyproductproblem')
  mongoose.set('debug', true)
}

require('./models/User')
require('./config/passport')

app.use(require('./routes'))

// Add headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://dailyproductproblem.herokuapp.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')

  err.status = 404
  next(err)
})

// / error handlers

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({ 'errors': {
    'message': err.message,
    'error': {}
  } })
})

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`)
})
