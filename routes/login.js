"use strict"
const userDb = require('../database/user-data'),
  users = userDb.users,
  methods = require('../methods'),
  cryptoRandomString = require('crypto-random-string')
var path = require('path');
//===============================================================GET
exports.get = function (request, response) {
  try {
    var clientHtml = __dirname + '/../views/resources/login/client.html'
    methods.handleCookie(request, response,()=>{response.sendFile(path.join(clientHtml))})
      .then((data) => { sendPage(data) })
    function sendPage(data) {
      if (data === null) {
         response.sendFile(path.join(clientHtml))
      } else {
        response.status(307)
        response.redirect('/')
      }
    }
  } catch (err) {
    console.log(err)
    response.status(500).send("error 500");
  }
}
//===============================================================POST
exports.post = function (request, response) {
  try {
    var username = request.body.username,
      password = request.body.password;
    const cookieSettings = { maxAge: 302400000, httpOnly: true, sameSite: 'Strict' },
      //function declaration
      validateInput = () => {
        if (methods.validate.input([username, password], 50, 'string') === false) {
          response.status(400).send("error 400");
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
          response.status(400).send("incorrect");
        } else {  
          checkPassword(data)
        }
      },
      checkPassword = (data) => {
        methods.hashComparison(password, data.password)
          .then((bool) => {
            if (bool !== true) {
              response.status(400).send("incorrect");
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
            response.status(500).send("error 500");
          } else {
            assignToken(token)
          }
        })
      },
      assignToken = (token) => {
        response.status(202)
          .cookie('userId', token, cookieSettings)
          .send('logged in')
      }
    validateInput()
  } catch (err) {
    console.log(err)
    response.status(500).send("error 500");
  }
}