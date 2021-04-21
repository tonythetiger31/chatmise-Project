'use strict';
const userDb = require('../database/user-data');
const methods = require('../methods');
var path = require('path');
function main(req, res) {
		var reactApp = __dirname + '/../views/resources/build/index.html';
	   res.sendFile(path.join(reactApp));
}
module.exports = main;