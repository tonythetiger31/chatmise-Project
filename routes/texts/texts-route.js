/*
WARNING
-if the user is trying to communicate with another tab on the same browser, no data will be sent
-if the user is on two devices, the devices won't be able to communicate
-only different users on separate devices will be able to communicate
*/
"use strict"
const
    userdb = require('../../db_config/db_userdata'),
    flores = userdb.flores,
    theboys = userdb.theboys,
    usertoken = userdb.usertoken,
    users = userdb.users,
    methods = require('../../methods'),
    textsMethods = require('./texts-methods');
// const textMethods = require('texts-route')
//===============================================================PUT
async function put(request, response) {
    //var declaration
    //if (request.body.text > 1000){}// protection against DDOS in progress
    console.log('just sent-- ', request.body.text)
    var sender = request.headers.cookie,
        time,
        text,
        chat,
        choose = false;
    //sucurity phases
    methods.sucurityCheck3Phase(sender, 'PUT').then((data) => {
        if (data == false) {
            response.status(400)
            response.send({ 'redirect': 'true' })
        } else {
            if (data.userInfo[0].usertoken == data.sender) {
                //response
                sender = data.userInfo[0].username
                if (Object.keys(request.body).length !== 0) {
                    /*things to sanatise are
                    any < > tags, any $ symbols, and other ones, */
                    text = request.body.text
                    time = request.body.time
                    chat = request.body.chat
                    console.log('new transmiton', sender, request.body)
                    var datadb = {
                        text: text,
                        time: time,
                        sender: sender
                    }
                    switch (chat) {
                        case ('flores'):
                            choose = flores
                            break
                        case ('theboys'):
                            choose = theboys
                            break
                        default:
                            choose = false
                            response.send(400)
                            response.send('give me data')
                    }
                    if (choose != false) {
                        var newtexts = new choose(datadb)
                        newtexts.save((error) => {
                            if (error) {
                                console.log('somthing happened witht the db -texts')
                            } else {
                                console.log('text saved')
                                response.status(200)
                                response.send({ "status": "text saved" })
                            };
                        });
                    };
                };
                //response end
            };
        };
    });
};
//===============================================================GET
async function get(request, response) {
    //var declaration
    var sender = request.headers.cookie,
        choose;
    //sucurity phase 1
    methods.sucurityCheck3Phase(sender, 'GET').then((data) => {
        if (data == false) {
            response.status(400)
            response.send({ 'redirect': 'true' })
        } else {
            if (data.userInfo[0].usertoken == data.sender) {
                //response
                switch (request.params.chat) {
                    case ('flores'):
                        choose = flores
                        break;
                    case ('theboys'):
                        choose = theboys
                        break;
                    default:
                        choose = false
                        response.status(400)
                        response.send('give me data')
                }
                if (choose != false) {
                    choose.countDocuments(function (err, count) {
                        if (err) {
                            console.log("there was a err at /text get")
                        } else {
                            response.status(200)
                            response.send({ "textNum": count });
                        };
                    });
                };
                //response end
            };

        };
    });
};
//===============================================================POST
async function post(request, response) {
    //var declaration
    var send2 = [],
        required = request.body.required,
        sender = request.headers.cookie,
        send1,
        choose,
        chooseN
    //sucurity phase 1
    methods.sucurityCheck3Phase(sender, 'GET').then((data) => {
        if (data == false) {
            response.status(400)
            response.send({ 'redirect': 'true' })
        } else {
            if (data.userInfo[0].usertoken == data.sender) {
                //response
                //if user wants all texts
                if (required == 'all') {
                    users.find({
                        username: data.userInfo[0].username
                    }).then((data2) => {//for giving all data pretaining to specific user 
                        textsMethods.grabAllUserInfo(data2)
                            .then((thisUserData) => {
                                //console.log('end of func', thisUserData.allTextsForThisUser)
                                response.status(200)
                                response.send({
                                    collections: thisUserData.collections,
                                    data: thisUserData.allTextsForThisUser,
                                    username: data.userInfo[0].username
                                })
                            })
                    })

                    //if user wants specific text
                } else if (typeof (required) != "string") {
                    switch (request.body.chat) {
                        case ('flores'):
                            choose = flores
                            chooseN = 'flores'
                            break;
                        case ('theboys'):
                            choose = theboys
                            chooseN = 'theboys'
                            break;
                        default:
                            choose = false
                            response.send(400)
                            response.send('give me data')
                    }
                    if (choose != false) {
                        choose.find({})
                            .then((data2) => {
                                for (let i = 0; i < required.length; i++) {
                                    if (data2[required[i]].sender != data.userInfo[0].username) {
                                        send1 = data2[required[i]]
                                        send2.push(send1)
                                    }
                                }
                                response.status(200)

                                response.send({ 'required': send2, 'chat': chooseN });
                            });
                    };
                };
                //response end
            };
        };
    });
};
module.exports = { post, get, put }