const userDb = require('../database/user-data')
const methods = require('../methods')
function logout(req, res){
   try {
      var cookie = req.headers.cookie
      const sendBadRequest = () => { res.status(400).send("error 400") }

      methods.handleCookie(req.headers.cookie)
         .then((data) => { 
            deleteToken(data) 
         })
      function deleteToken(data) {
         if (data === null){
            sendBadRequest()
         }else{
            userDb.userToken.deleteOne({ token: cookie }, (err) => {
               if (err) {
                  console.log('error removing user token')
                  res.status(200).send({ 'response': 'success' })
               }
               else {
                  res.cookie('userId', '', { maxAge: 0, httpOnly: true })
                  res.status(200).send({ 'response': 'success' })
               }
            });
         }
      }
   } catch (err) {
      console.log(err)
      res.status(500).send("error 500")
   }
}
module.exports = logout