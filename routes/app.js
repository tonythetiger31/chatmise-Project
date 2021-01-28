"use strict"
const userDb = require('../database/user-data')
const methods = require('../methods')
var path = require('path');
exports.main = function (req, res) {
    try {
        var homeHtml = __dirname + '/../views/home/index.html',
            appEjs = __dirname + '/../views/resources/app/index.ejs'
        methods.handleCookie(req, res, ()=>{res.sendFile(path.join(homeHtml))})
            .then((data) => { sendPage(data) })
        function sendPage(data) {
            if (data === null) {
                res.sendFile(path.join(homeHtml));
            } else {
                var username = data.username
                res.render(appEjs, { username: username })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("error 500");
    }
}