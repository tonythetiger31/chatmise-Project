//"use strict"
const userdb = require('../db_config/db_userdata')
// const chatroomdb = require('../db_config/db_chatrooms')
const texts = userdb.texts
const usertoken = userdb.usertoken
const methods = require('../methods')
//===============================================================PUT
exports.put = function(request, response) {
//var declaration
    //if (request.body.text > 1000){}// protection against DDOS in progress
    console.log('just sent-- ', request.body.text)
    var sender = request.headers.cookie
//sucurity phase 1
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts PUT denial phase 1')
        response.status(401)
        response.send({'redirect': 'true'})
    } else {
//sucurity phase 2
        sender = methods.cookieParse(sender, 'userId')
        if (sender == undefined || sender == null || sender == '') {
            console.log('texts PUT denial phase 2')
            response.status(401)
            response.send({'redirect': 'true'})
        } else {
//sucurity phase 3
            cSender = sender
            usertoken.find({
                    usertoken: sender
                })
                .then((data) => {
                    if (data == '') {
                        console.log('texts PUT denial phase 3')
                        response.status(403)
                        response.send({'redirect': 'true'})
                    } else {
                        if (data[0].usertoken == cSender) {
//response
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
                                        response.status(200)
                                        response.send({"status" : "text saved"})
                                    }
                                })
                            }
//response end
                        }
                    }
                })
        }
    }
}
//===============================================================GET
exports.get = function(request, response) {
//var declaration
    var sender = request.headers.cookie
    var datalength 
//sucurity phase 1
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts GET denial phase 1')
        response.status(401)
        response.send({'redirect': 'true'})
    } else {
//sucurity phase 2
        sender = methods.cookieParse(sender, 'userId')
        if (sender == undefined || sender == null || sender == '') {
            console.log('texts GET denial phase 2')
            response.status(401)
            response.send({'redirect': 'true'})
        } else {
//sucurity phase 3
            usertoken.find({
                    usertoken: sender
                })
                .then((data) => {
                    if (data == '') {
                        console.log('texts GET denial phase 3')
                        response.status(403)
                        response.send({'redirect': 'true'})
                    } else {
                        if (data[0].usertoken == sender) {
//response
                            texts.find({})
                                .then((data2) => {
                                    datalength = data2.length
                                    response.status(200)
                                    response.send({"textNum" : datalength});
                                })
//response end
                        }
                    }
                })
        }
    }
}
//===============================================================POST
exports.post = function(request, response) {
//var declaration
    var send2 = []
    var required = request.body.required
    var sender = request.headers.cookie
//sucurity phase 1
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts POST denial phase 1')
        response.status(401)
        response.send({
            'redirect': 'true'
        })
    } else {
//sucurity phase 2
        sender = methods.cookieParse(sender, 'userId')
        if (sender == undefined || sender == null || sender == '') {
            console.log('texts POST denial phase 2')
            response.status(401)
            response.send({
                'redirect': 'true'
            })
        } else {
//sucurity phase 3
            cSender = sender
            usertoken.find({
                    usertoken: sender
                })
                .then((data) => {
                    if (data == '') {
                        console.log('texts POST denial phase 3')
                        response.status(403)
                        response.send({
                            'redirect': 'true'
                        })
                    } else {
                        //
                        if (data[0].usertoken == cSender) {
//response
                            if (required == 'all'){
                                texts.find({})
                                .then((data2) => {
                                    response.status(200)
                                    response.send(data2);
                                })
                            } else if (typeof(required) != "string"){
                                texts.find({})
                                .then((data2) => {
                                    for (i = 0; i < required.length;i++){
                                        if (data2[required[i]].sender != data[0].username){
                                        send1 = data2[required[i]]
                                        send2.push(send1)
                                        }
                                    }
                                    response.status(200)
                                    response.send(send2);
                                })
                            }
//response end
                        }
                    }
                })
        }
    }
}