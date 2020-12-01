/*contents
-package declaration
-database
-server info/ start server
-var declaration
-function declaration
-page directories rendered
-page directories un-rendered
-setInterval functions
*/                                                                                                                                                                                                                                                                                                             
//_______________________________________________________|
//____________________________________|package declaration
//_______________________________________________________|
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
textsDir = require('./routes/texts/texts'),
themeDir = require('./routes/theme'),
methods = require('./methods'),
mainDir = require('./routes/app'),
loginDir = require('./routes/login'),
logoutDir = require('./routes/logout'),
signupDir = require('./routes/signup')
//
app.use(express.urlencoded({
    extended: true
  })) 
//header_options
app.disable('x-powered-by');  
//_______________________________________________________|
//______________________________|server info/ start server
//_______________________________________________________|
const PORT = process.env.PORT || 80; 
server.listen(PORT, () => console.log('--server started on port ' + PORT));
app.use(express.static('views'))
app.use(express.json())
//_______________________________________________________|
//_______________________________|page directories rendered
//_______________________________________________________|
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
app.get('/signup', signupDir.get);
app.get('/admin',signupDir.get);
//_______________________________________________________|
//____________________________|page directories un-rendered
//_______________________________________________________|
//=========================================/sockets
io.on('connection', textsDir.sockets)
//=========================================/loginPost
app.post('/login', loginDir.post)
//=========================================/LOGOUT
app.delete('/logout', logoutDir.main)
//=========================================/theme
app.post('/theme', themeDir.post)
app.get('/theme', themeDir.get)