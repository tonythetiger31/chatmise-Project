/*contents
-package declaration
-server options
-page directories rendered
-page directories un-rendered
-error page
-server start server
*/                                                               
//____________________________________|package declaration
"use strict"
//dependencies
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
var path = require('path')
//env variables
require('dotenv').config()
//project files
const
textsDir = require('./routes/texts'),
themeDir = require('./routes/theme'),
methods = require('./methods'),
mainDir = require('./routes/app'),
loginDir = require('./routes/login'),
logoutDir = require('./routes/logout'),
signupDir = require('./routes/signup')
//_______________________________|server options
app.use(express.urlencoded({
    extended: true
  })) 
app.disable('x-powered-by');
app.use(express.static('views'))
app.use(express.json())
//_______________________________|page directories rendered
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
// app.get('/signup', signupDir.get);
//_______________________________|page directories un-rendered 
io.on('connection', textsDir.sockets)
app.post('/login', loginDir.post)
app.delete('/logout', logoutDir.main)
app.post('/theme', themeDir.post)
app.get('/theme', themeDir.get)
//_______________________________|404 page
app.get('*', methods.pageNotFound)

//_______________________________|server info/ start server
const PORT = process.env.PORT || 80; 
server.listen(PORT, () => console.log('--server started on port ' + PORT));