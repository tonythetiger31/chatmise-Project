"use strict"
const userDb = require('../database/user-data'),
  users = userDb.users,
  methods = require('../methods'),
  cryptoRandomString = require('crypto-random-string')
var path = require('path');
//===============================================================GET
exports.get = function (req, res) {
  try {
    var clientHtml = __dirname + '/../views/resources/auth/login.html'
    methods.handleCookie(req.headers.cookie)
      .then((data) => { sendPage(data) })
    function sendPage(data) {
      if (data === null) {
         res.sendFile(path.join(clientHtml))
      } else {
        res.status(307)
        res.redirect('/')
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("error 500");
  }
}
//===============================================================POST
exports.post = function (req, res) {
  try {
    var username = req.body.username,
      password = req.body.password;
    const cookieSettings = { maxAge: 302400000, httpOnly: true, sameSite: 'Strict' },
      //function declaration
      validateInput = () => {
        if (methods.validate.input([username, password], 50, 'string') === false) {
          res.status(400).send("error 400");
        } else {
          findUser()
        }
      },
      findUser = () => {
        users.findOne({
          username: username
        }).then((data) => {
          checkUsername(data)
        })
      },
      checkUsername = (data) => {
        if (data === null) {
          res.status(400).send("incorrect");
        } else {  
          checkPassword(data)
        }
      },
      checkPassword = (data) => {
        methods.hashComparison(password, data.password)
          .then((bool) => {
            if (bool !== true) {
              res.status(400).send("incorrect");
            } else {
              createToken()
            }
          })
      },
      createToken = () => {
        var token = cryptoRandomString({ length: 20, type: 'alphanumeric' }),
          session = {
            token: token,
            username: username
          },
          newToken = new userDb.userToken(session);
        newToken.save((err) => {
          if (err) {
            console.log('something happened with the db')
            res.status(500).send("error 500");
          } else {
            assignToken(token)
          }
        })
      },
      assignToken = (token) => {
        res.status(202)
          .cookie('userId', token, cookieSettings)
          .send('logged in')
      }
    validateInput()
  } catch (err) {
    console.log(err)
    res.status(500).send("error 500");
  }
}