/*
WARNING
-if the user is trying to communicate with another tab on the same browser, no data will be sent
-if the user is on two devices, the devices won't be able to communicate
-only different users on separate devices will be able to communicate
*/
"use strict"
const { ChangeStream } = require('mongodb')
const { Collection } = require('mongoose')
const { users } = require('../db_config/db_userdata')
const userdb = require('../db_config/db_userdata')
// const chatroomdb = require('../db_config/db_chatrooms')
const regulars = userdb.regulars
const theboys = userdb.theboys
const usertoken = userdb.usertoken
const methods = require('../methods')
//===============================================================PUT
exports.put = async function(request, response) {
//var declaration
    //if (request.body.text > 1000){}// protection against DDOS in progress
    console.log('just sent-- ', request.body.text)
    var sender = request.headers.cookie
    var cSender
    var time
    var text
    var chat
    var choose = false
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
                                chat = request.body.chat
                                console.log('new transmiton----', sender, request.body, '----')
                                var datadb = {
                                    text: text,
                                    time: time,
                                    sender: sender
                                }
                                switch(chat){
                                    case('flores'):
                                        choose = regulars
                                    break;
                                    case('theboys'):
                                        choose = theboys
                                    break;
                                    default:
                                        choose = false
                                        response.send(400)
                                        response.send('give me data')
                                }
                                if (choose != false){
                                var newtexts = new choose(datadb);
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
                            }
//response end
                        }
                    }
                })
        }
    }
}
//===============================================================GET
exports.get = async function(request, response) {
//var declaration
    var sender = request.headers.cookie
    var choose
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
switch(request.params.chat){
    case('flores'):
        choose = regulars
    break;
    case('theboys'):
        choose = theboys
    break;
    default:
        choose = false
        response.send(400)
        response.send('give me data')
}
if (choose != false){
choose.countDocuments(function (err, count){
    if (err){
        console.log("there was a err at /text get")
    } else {
        response.status(200)
        response.send({"textNum" : count});
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
//===============================================================POST
exports.post = async function(request, response) {
    //var declaration
    var send2 = []
    var required = request.body.required
    var sender = request.headers.cookie
    var cSender
    var send1
    var choose
    var chooseN
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

                        if (data[0].usertoken == cSender) {
//response
                            if (required == 'all') {
                                users.find({
                                        username: data[0].username
                                    })
                                    .then( (data2) => {//for giving all data pretaining to specific user
                                        var checkerR = false
                                        var checkerT = false
                                        data2[0].chats.forEach((i) => {
                                            switch (i) {
                                                case ("regulars"):
                                                    checkerR = true
                                                    break;
                                                case ("theboys"):
                                                    checkerT = true
                                                    break;
                                            }
                                        })

                                        if (checkerR == true && checkerT == false) {
                                            regulars.find({})
                                                .then((data3) => {
                                                    response.status(200)
                                                    response.send({
                                                        collections:['flores'], 
                                                        data: [data3]});
                                                })
                                        } else if (checkerR == false && checkerT == true) {
                                            theboys.find({})
                                                .then((data3) => {
                                                    response.status(200)
                                                    response.send({
                                                        collections:["theboys"], 
                                                        data: [data3]})
                                                })
                                        } else if (checkerR == true && checkerT == true) {
                                            theboys.find({})
                                                .then((data3) => {
                                                    regulars.find({})
                                                        .then((data4) => {
                                                            response.status(200)
                                                            response.send({
                                                                collections:["theboys","flores"], 
                                                                data: [data3, data4]})
                                                        })
                                                })
                                        }

                                    })
                            } else if (typeof(required) != "string") {
                                switch(request.body.chat){
                                    case('flores'):
                                        choose = regulars
                                        chooseN = 'regulars'
                                        console.log('reguars')
                                    break;
                                    case('theboys'):
                                        choose = theboys
                                        chooseN = 'theboys'
                                        console.log('rstheboys')
                                    break;
                                    default:
                                        console.log('stupid')
                                        choose = false
                                        response.send(400)
                                        response.send('give me data')
                                }
                                if (choose != false){
                                choose.find({})
                                    .then((data2) => {
                                        for (let i = 0; i < required.length; i++) {
                                            console.log(required)
                                            if (data2[required[i]].sender != data[0].username) {
                                                send1 = data2[required[i]]
                                                send2.push(send1)
                                            }
                                        }
                                        response.status(200)
                                        response.send({'required': send2, 'chat': chooseN});
                                    })
                            }
                        }
                            //response end
                        }
                    }
                })
        }
    }}