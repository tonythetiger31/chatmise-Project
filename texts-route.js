const database = require('./database')
const texts = database.texts
exports.main =  function(request, response){
        if (Object.keys(request.body).length !== 0){
            text = request.body.text
            time = request.body.time
            sender = request.body.sender
            console.log('new transmiton----',request.body,'------------')
            var datadb = {
                text: text,
                time: time,
                sender: sender
            }
            var newtexts = new texts(datadb);
            newtexts.save((error) => {
                if (error) {
                    console.log('somthing happened witht the db -texts')
                } else {
                    console.log('text saved')
                }
            })
        }
        texts.find({})
        .then((data)=>{
        response.send(data);
        })
}