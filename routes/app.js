"use strict"
const userDb = require('../database/user-data')
const methods = require('../methods')
var path = require('path');
exports.main = function (request, response) {
    try {
        var homeHtml = __dirname + '/../views/home/index.html',
            appEjs = __dirname + '/../views/resources/app/index.ejs'
        methods.handleCookie(request, response, ()=>{response.sendFile(path.join(homeHtml))})
            .then((data) => { sendPage(data) })
        function sendPage(data) {
            if (data === null) {
                response.sendFile(path.join(homeHtml));
            } else {
                var username = data.username
                response.render(appEjs, { username: username })
            }
        }
    } catch (err) {
        console.log(err)
        response.status(500).send("error 500");
    }
}