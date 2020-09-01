const database = require('../database')
const texts = database.texts
const usertoken = database.usertoken
const methods = require('../methods')
exports.post = function(request, response) {
    //if (request.body.text > 1000){
    //}
    var sender = request.headers.cookie
    if (sender == undefined || sender == null || sender == '') {
        response.send({
            'redirect': 'true'
        })
    } else {
        sender = methods.cookieParse(sender, 'userId')
        if (sender == undefined || sender == null || sender == '') {
            response.send({
                'redirect': 'true'
            })
        } else {
            cSender = sender
            usertoken.find({
                    usertoken: sender
                })
                .then((data) => {
                    if (data == '') {
                        response.send({
                            'redirect': 'true'
                        })
                    } else {
                        if (data[0].usertoken == cSender) {
                            sender = data[0].username

                            if (Object.keys(request.body).length !== 0) {
                                text = request.body.text
                                time = request.body.time

                                console.log('new transmiton----', request.body, '----')
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
                        }
                    }
                })
        }
    }
}
exports.get = function(request, response) {
    var sender = request.headers.cookie
    if (sender == undefined || sender == null || sender == '') {
        response.status(403)
        response.send({
            'redirect': 'true'
        })
    } else {
        sender = methods.cookieParse(sender, 'userId')
        if (sender == undefined || sender == null || sender == '') {
            response.status(403)
            response.send({
                'redirect': 'true'
            })
        } else {
            cSender = sender
            usertoken.find({
                    usertoken: sender
                })
                .then((data) => {
                    if (data == '') {
                        response.status(403)
                        response.send({
                            'redirect': 'true'
                        })
                    } else {
                        if (data[0].usertoken == cSender) {
                            texts.find({})
                                .then((data2) => {
                                    response.send(data2);
                                })
                        }
                    }
                })
        }
    }
}