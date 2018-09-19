require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { format } = require('date-fns')

// Connect to our Database and handle any bad connections
const mongoose = require('mongoose')
const mongoDB = process.env.DATABASE
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
)
mongoose.Promise = global.Promise
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
})

// Initialise the Express app
const app = express()
app.set('port', process.env.PORT || 7777)

// Serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')))

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Populates req.cookies with any cookies that came along with the request
// app.use(cookieParser())

app.get('/api/time', (req, res) => {
  const time = format(new Date(), 'eeee MMMM do YYYY, h:mm:ss aa')
  res.json({ time })
})

if (process.env.NODE_ENV === 'production') {
  // Serve production version of React app from build folder
  app.use(express.static(path.join(__dirname, 'client/build')))

  // All get requests (except any defined above) will be handled by react-router
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

// Catch 404 and forward to error handler
// This will never happen on GET requests in production, because they're already caught by React
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.send('404')
})

const server = app.listen(app.get('port'), () =>
  console.log(
    `Express running`,
    ` → PORT ${server.address().port}`,
    ` → ENV '${process.env.NODE_ENV || 'not set'}'`
  )
)

module.exports = app
