const userDb = require('../database/user-data')
const methods = require('../methods')
//===============================================================POST
exports.post = (req, res) => {
   const ERR_MSG = "Something wrong when updating theme data!"
   const sendBadRequest = () => { res.status(400).send("error 400") }
   validateInput()
   function validateInput() {
      if (methods.validate.input([req.body.val], 10, 'string') === false) {
         sendBadRequest()
      } else {
         hanldeCookieLogic()
      }
   }
   function hanldeCookieLogic() {
      methods.handleCookie(req.headers.cookie)
         .then((data) => {
            updateThemeValue(data)
         })
   }
   function updateThemeValue(data) {
      if (data === null) {
         sendBadRequest()
      } else {
         userDb.users.findOneAndUpdate({
            username: data.username
         }, {
            settings: req.body.val
         }, (err) => {
            if (err) {
               console.log(ERR_MSG);
               res.status(500).send(ERR_MSG);
            }
            res.status(200).send({ response: 'theme options updated' })
         })
      }
   }
}
//===============================================================GET
exports.get = (req, res) => {
   const sendBadRequest = () => { res.status(400).send("error 400") }
   hanldeCookieLogic()
   function hanldeCookieLogic() {
      methods.handleCookie(req.headers.cookie)
         .then((data) => {
            findTheme(data)
         })
   }
   function findTheme(data) {
      if (data === null) {
         sendBadRequest()
      } else {
         userDb.users.findOne({
            username: data.username
         })
            .then((data1) => {
               res.status(200).send({ "settings": data1.settings })
            })
      }
   }
}