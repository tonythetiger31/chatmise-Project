/*contents
-variable declerations
-functions
-setinterval functions
-style functions
*/
"use strict"
document.addEventListener("DOMContentLoaded", loadstop);
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================Variables
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var allChatsTextCount = [],
//number of texts currently loaded for all chats
currentTextIndex,
//index of current chat withing textNum
allCurrentUserChats,
currentChat,
//current chat user is in
username,
    userCountTipBoolean = true,
allTextsBool = true,
messageSound = document.getElementById("myAudio")
messageSound.volume = 0.15
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================socket.io connection
var socket = io()  
//=======================================cookieParser
function parseCookie(cookie, key) {
    cA = cookie.split(/[;=]+/);
    cB = cA.indexOf(key) + 1
    cB = cA[cB]
    cB = cB.toString()
    return (cB)
}
//=======================================themePost
async function postChangedSettings(settingval) {
    var data = {
        val: settingval
    }
    const options = {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/theme', options);
    const json = await response.json();
}
//=======================================themeGet
function getSettings() {
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/theme', options).then(response => response.json()).then((body) => {
        var themetype = body.settings
        selectTheme(themetype)
    }
    )
}
//=======================================logout
async function logoutUser() {
    //logs user out
    const options = {
        method: 'delete',
    };
    const response = await fetch('/logout', options);
    const json = await response.json();
    location.replace("/login")
}
//=======================================postUserToken
async function postUserToken() {
    /*send user id to see how
     many users there are*/
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/Ucount', options)
        .then(response => response.json())
        .catch(error => internetWarning(true))
        .then((body) => {
            if (body !== undefined) {
                document.getElementById("Count").innerHTML = body;
                document.getElementById("Count2").innerHTML = body;
                internetWarning(false)
            } else {
                document.getElementById("Count").innerHTML = '-';
            }
        })
}
//=======================================fetch
socket.on('text', (body) => { 
            addNewMessageToHtml(body.chat, body.text, body.sender, body.time)
})
//=======================================serverPutData
async function putUserOutgoingTexts(info, date) {
    /*sends data to server
     and recives*/
    allChatsTextCount[currentTextIndex] += 1
    info[0] = info[0].trim()
    //removes white space
    info = info[0]
    //removes array from string
    var CTime = date
    socket.emit('texts', {
        text: info,
        time: CTime,
        chat: currentChat})
}
;//=======================================serverGetDataOnLoad
socket.on('allTexts', (data) => {
    if (allTextsBool == true) {
        var person = []
        var thisTextTime
        //display chat
        allCurrentUserChats = data.collections
        data.collections.forEach((element, i, arr) => {
            displayAllChatsInMenu(element, i)
        }
        );
        //get username
        username = data.username
        //
        data.collections.forEach((element1, i1) => {
            var SMSG2 = []
            person = []
            thisTextTime = []
            data.data[i1].forEach((element, i) => {
                SMSG2.push(data.data[i1][i].text)
            }
            )
            data.data[i1].forEach((element, i) => {
                person.push(data.data[i1][i].sender)
            }
            )
            data.data[i1].forEach((element, i) => {
                thisTextTime.push(data.data[i1][i].time)
            })
            displayAllServerMessages(element1, SMSG2, person, thisTextTime)
            allChatsTextCount.push(SMSG2.length)
        }
        )
        getSettings()
        allTextsBool = false
    }
})
//=======================================displayChat
function displayAChat(current, index) {
    // displays chat pressed
    allCurrentUserChats.forEach((element) => {
        document.getElementById(element + 'Anchor').style.display = "none";
    }
    )
    document.getElementById(current + 'Anchor').style.display = "block";
    document.getElementById('chatTitle').innerHTML = current
    currentChat = current;
    currentTextIndex = index
    document.getElementById('chatMenu').style.display = 'none'
    document.getElementById('messageInputFeild').style.display = 'flex'
    document.getElementById('tip1').style.display = 'none'
    document.getElementById(current + 'Anchor').lastChild.scrollIntoView()
}
//=======================================displayAllChatsInMenu
function displayAllChatsInMenu(chat, index) {
    // displays all chats
    var div = document.createElement('div');
    div.setAttribute('class', 'chatFuncButton')
    div.innerHTML = '<div onclick="displayAChat(\'' + chat + '\',' + index + ')">' + sanitize(chat) + '</div>'
    document.getElementById("topchat").appendChild(div);
}
//=======================================displayServerMessage
function displayAllServerMessages(chat, text, sender, time) {
    /*displays message procesed
     by getAllChatsUsernameAndTexts()*/
    var parentDiv = document.createElement("div")
    parentDiv.id = chat + 'Anchor'
    parentDiv.style.display = "none"
    document.getElementById("message").appendChild(parentDiv);
    text.forEach((element, i) => {
        var div = document.createElement("div");
        if (sender[i] == username) {
            div.innerHTML = '<div class="textInfo"><span class="userSenderName"> you -' + '</span> <span class="textsTime">' + getNormalTimeFromUTC(time[i]) + '</span></div><div>' + sanitize(text[i]) + '</div>';
            div.setAttribute('class', 'youText')
        } else {
            div.innerHTML = '<div class="textInfo"><span class="textSenderName">' + sender[i] + ' -' + '</span> <span class="textsTime">' + getNormalTimeFromUTC(time[i]) + '</span></div><div>' + sanitize(text[i]) + '</div>';
            div.setAttribute('class', 'text')
        }
        document.getElementById(parentDiv.id).appendChild(div);
        div.scrollIntoView();
    }
    )
}
;//=======================================sAjaxInputMessage
function addNewMessageToHtml(chat, text, sender, time) {
    //adds ajax messages
    console.log('sajax executed')
    if (document.visibilityState !== 'visible') {
        messageSound.play()
    }
        var div = document.createElement("div")
        div.innerHTML = '<span class="textSenderName">' + sender + ' - ' + '</span> <span class="textsTime">' + getNormalTimeFromUTC(time) + '</span><div>' + sanitize(text) + '</div>';
        div.setAttribute('class', 'text')
        document.getElementById(chat + 'Anchor').appendChild(div);
        div.scrollIntoView();
}
//=======================================inputMessage
function displayAndSendOutGoingMessage() {
    //adds messages in input
    var thisTime = new Date().getTime()
    var J = []
    let R = "";
    let inputValue = document.getElementById("input").value;
    if (inputValue !== "" && inputValue.trim().length !== 0) {
        let div = document.createElement("div")
        div.innerHTML = '<span class="userSenderName"; float:left;">' + 'you - ' + '</span> <span class="textsTime">' + getNormalTimeFromUTC(thisTime) + '</span><div>' + sanitize(inputValue) + '</div>';
        div.setAttribute('class', 'youText')
        document.getElementById(currentChat + 'Anchor').appendChild(div);
        div.scrollIntoView();
        document.getElementById("input").value = "";
        J.push(inputValue);
        putUserOutgoingTexts(J, thisTime);
        document.getElementById('input').focus();
    }
}
;//=======================================_EnterKey
function sendMessageWhenEnterKeyPressed(event) {
    /* when "enter" key is pressed 
    make inputMessage() happen*/
    let X = event.keyCode;
    if (X == 13) {
        displayAndSendOutGoingMessage();
        event.preventDefault();
    };
}
; function sanitize(str) {
    return (str.replace(/[></&"',\]\[{}\\():;]/g, x => {
        var htmlEscaped = {
            '<': '&#60;',
            '>': '&#62;',
            '/': '&#47;',
            '&': '&#38;',
            '"': '&#34;',
            '\'': '&#39;',
            ',': '&#44;',
            '[': '&#91;',
            ']': '&#94;',
            '{': '&#123;',
            '}': '&#125;',
            '\\': '&#92;',
            '(': '&#40;',
            ')': '&#41;',
            ':': '&#58;',
            ';': '&#59;',
        }
        return (htmlEscaped[x])
    }
    ))
}
function getNormalTimeFromUTC(thisDate) {
    var pmOrAm
    var hoursNon24
    var minutesWithOrWithoutZero
    thisDate = new Date(thisDate)
    if (thisDate.getHours() > 12) {
        pmOrAm = 'PM'
        hoursNon24 = thisDate.getHours() - 12
    } else {
        pmOrAm = 'AM'
        hoursNon24 = thisDate.getHours()
    }
    if (thisDate.getMinutes() <= 9) {
        minutesWithOrWithoutZero = '0'
    } else {
        minutesWithOrWithoutZero = ''
    }
    var output = (thisDate.getMonth()
        + 1 + '/' + thisDate.getDate())
        + '/' + thisDate.getFullYear()
        + ' ' + hoursNon24
        + ':' + minutesWithOrWithoutZero + thisDate.getMinutes()
        + ' ' + pmOrAm;
    return (output)
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================setinterval functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
setInterval(postUserToken, 5000);
postUserToken()
//sends id as soon as load instead of waiting 5s
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================style functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================openCloseSettingsMenu
function openCloseUserCountTip(){
    if (userCountTipBoolean === true) {
        document.getElementById('userCountTip').style.display = "block";
        userCountTipBoolean = false
    } else {
        document.getElementById('userCountTip').style.display = "none";
        userCountTipBoolean = true
    }
}
function internetWarning(arg) {
    if (arg === true) {
        document.getElementById('internetWaring').style.display = "block";
    } else {
        document.getElementById('internetWaring').style.display = "none";
    }
}
function openCloseHamburgerMenu(arg) {
    if (arg === 'open') {
        //opens settings
        document.getElementById('uiWrapper').style.display = "none";
        document.getElementById('hamburgerMenuWrapper').style.display = "block";
        document.getElementById('chatMenu').style.display = "none";
        document.getElementById('userCountTip').style.display = "none";
    } else if (arg === 'close') {
        document.getElementById('uiWrapper').style.display = "block";
        document.getElementById('hamburgerMenuWrapper').style.display = "none";
        document.getElementById('chatMenu').style.display = "none";
    }
    if (currentChat !== undefined) {
        var currentChatId = document.getElementById(currentChat + 'Anchor').lastChild
        currentChatId.scrollIntoView();
    }
}
function openCloseSettingsMenu(arg){
    if (arg === 'open') {
        //opens settings
        document.getElementById('settingsContainer').style.display = "block";
        document.getElementById('hamburgerMenuContainer').style.display = "none";
    } else if (arg === 'close') {
        document.getElementById('settingsContainer').style.display = "none";
        document.getElementById('hamburgerMenuContainer').style.display = "block";
    }
}
function openCloseChatMenu(arg) {
    if (arg === 'open') {
        //opens settings
        document.getElementById('chatMenu').style.display = "block";
        document.getElementById("chatMenu").focus()
    } else if (arg === 'close') {
        document.getElementById('chatMenu').style.display = "none";
    }
}
//=======================================selectAndPostValueOfTheme
function selectAndPostValueOfTheme() {
    var themesetting = document.getElementById('themesetting').value
    selectTheme(themesetting)
    postChangedSettings(themesetting)
}
//=======================================selectTheme
function selectTheme(themeint) {
    //selects from multiple themes
    var ti = themeint.toString()
    let root = document.documentElement.style;
    document.getElementById('themesetting').value = ti
    switch (ti) {
        case '1':
            //black
            root.setProperty('--bodyColor', "rgb(20, 20, 20)");
            root.setProperty('--textColor', "white");
            root.setProperty('--hamburgerColor', "brightness(100%)");
            root.setProperty('--textareaColor', "rgb(20, 20, 20)");
            root.setProperty('--buttonColor', "rgb(20, 20, 20)");
            root.setProperty('--textareaAbuttonTextColor', "white");
            root.setProperty('--yellowColor', "rgb(238, 241, 35);");
            root.setProperty('--lineColor', "white");
            root.setProperty('--greenColor', "#52fb9e");
            root.setProperty('--topBarColor', 'rgb(30,30,30)')
            root.setProperty('--blueColor', '#63caec')
            break;
        case '2':
            //gray
            root.setProperty('--bodyColor', "rgb(56, 56, 56)");
            root.setProperty('--textColor', "white");
            root.setProperty('--hamburgerColor', "brightness(100%)");
            root.setProperty('--textareaColor', "rgb(56, 56, 56)");
            root.setProperty('--buttonColor', "rgb(56, 56, 56)");
            root.setProperty('--textareaAbuttonTextColor', "white");
            root.setProperty('--yellowColor', "rgb(238, 241, 35);");
            root.setProperty('--lineColor', "white");
            root.setProperty('--greenColor', "#52fb9e");
            root.setProperty('--topBarColor', 'rgb(70,70,70)')
            root.setProperty('--blueColor', '#63caec')
            break;
        case '3':
            //white
            root.setProperty('--bodyColor', "white");
            root.setProperty('--textColor', "rgb(56, 56, 56)");
            root.setProperty('--hamburgerColor', "brightness(30%)");
            root.setProperty('--textareaColor', "white");
            root.setProperty('--buttonColor', "white");
            root.setProperty('--textareaAbuttonTextColor', "rgb(56, 56, 56)");
            root.setProperty('--yellowColor', "rgb(196, 199, 0);");
            root.setProperty('--lineColor', "black");
            root.setProperty('--greenColor', "#0bdc12");
            root.setProperty('--topBarColor', 'rgb(200,200,200)')
            root.setProperty('--blueColor', '#0095ff')
    }
}
function loadstop() {
    document.getElementById("loadimg").style.display = "none";
}