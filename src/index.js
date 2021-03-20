"use strict"
//dependencies
const express = require('express')
const app = express()
const server = require('http').createServer(app)
var cors ,io
var path = require('path')

//env variables
require('dotenv').config()

//project files
const
   socketDir = require('./routes/socket'),
   themeDir = require('./routes/theme'),
   methods = require('./methods'),
   mainDir = require('./routes/app'),
   loginDir = require('./routes/login'),
   logoutDir = require('./routes/logout'),
   signupDir = require('./routes/signup')

//development enviorment check
if (process.env.NODE_ENV === "development") {
   console.log('--development Env')
   cors = require('cors')
   app.use(cors())
   io = require('socket.io')(server, {
      cors: {
         origin: "http://localhost:3000",
         methods: ["GET", "POST"],
         credentials: true
      }
   })
} else {
   console.log('--production Env')
   io = require('socket.io')(server)
}
//_______________________________|server options
app.use(express.urlencoded({
   extended: true
}))
app.disable('x-powered-by');
app.use(express.static('src/views'))
app.use(express.json())
//_______________________________|page directories rendered
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
// app.get('/signup', signupDir.get);
//_______________________________|page directories un-rendered 
io.on('connection', socketDir.sockets)
app.post('/login', loginDir.post)
app.delete('/logout', logoutDir.main)
app.post('/theme', themeDir.post)
app.get('/theme', themeDir.get)
//_______________________________|404 page
app.get('*', methods.pageNotFound)
//_______________________________|server info/ start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('--server started on port ' + PORT));