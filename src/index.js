'use strict';
console.clear();
//dependencies
const express = require('express');
const app = express();
const server = require('http').createServer(app);
require('dotenv').config();
var cors, io;

//project files
const socketDir = require('./socket.io/socketIndex.js'),
	{ pageNotFound } = require('./methods'),
	main = require('./routes/app'),
	{ auth } = require('./routes/auth'),
   { newAccount } = require('./routes/new-account');
   
//development enviorment check
const envCheck = (() => {
	if (process.env.NODE_ENV === 'development') {
		console.log('\x1b[43m\x1b[30m', '<DEVELOPMENT-ENV>', '\x1b[0m');
		cors = require('cors');
		app.use(cors());
		io = require('socket.io')(server, {
			cors: {
				origin: 'http://localhost:3000',
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});
	} else {
		console.log('\x1b[42m', '<PRODUCTION-ENV>', '\x1b[0m');
		io = require('socket.io')(server, {
			cors: {
				origin: CLIENT_URL,
				methods: ['GET', 'POST'],
				credentials: true,
			}
		});
	}
})();

//server options
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(express.static('src/views'));
app.use(express.json());

//page directories rendered
app.get('/', main);

io.on('connection', socketDir.sockets); //socket

//page directories un-rendered
app.post('/new-account', newAccount);
app.post('/auth', auth);

app.get('*', pageNotFound); //404 page

//server info/ start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('--server started on port ' + PORT));
