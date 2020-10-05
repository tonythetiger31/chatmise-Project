
/*contents
-authentication
-variable declerations
-functions
-setinterval functions
-style functions
*/
document.addEventListener("DOMContentLoaded", loadstop);
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================Variables
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var txtNum = []//number of texts currently loaded for all chats
var currentTxtNum//index of current chat withing textNum
var userChats
var currentChat//current chat user is in
var date = new Date();
var messageSound =  document.getElementById("myAudio")
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================cookiepareser
function parseCookie(cookie, key) {
    cA = cookie.split(/[;=]+/);
    cB = cA.indexOf(key) + 1
    cB = cA[cB]
    cB = cB.toString()
    return (cB)
}
//=======================================themePost
async function postChangedSettings(settingval){
    data = {val : settingval}
    const options = {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/theme', options);
    const json = await response.json();
    console.log(json)
}
//=======================================themeGet
function getSettings(){
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/theme', options)
    .then(response=>response.json())
    .then((body)=>{
        themetype = body.settings
        selectTheme(themetype)
    })
}
//=======================================logout
async function logoutUser(){
    //logs user out
    const options = {
        method: 'delete',
    };
    const response = await fetch('/logout', options);
    const json = await response.json();
    location.replace("/login")
}
//=======================================postUserToken
async function postUserToken(){
    /*send user id to see how
     many users there are*/
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('/Ucount', options);
    const json = await response.json();
    if (json == 1){
        document.getElementById("Count").innerHTML = ': only you';
    }else{
        document.getElementById("Count").innerHTML = ": "+json;
    } 
}
//=======================================sajax
async function getChatSize() {
    if (currentChat != undefined) {
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch('/texts/' + currentChat, options)
            .then(response => response.json())
            .then((body) => {
                //SECOND PART
                if (body.redirect == 'true') {
                    location.replace('/login')
                    // if current text and recived texts dont match make post req
                } else if (body.textNum != txtNum[currentTxtNum]) {
                    console.log('server txt: ', body.textNum, 'client txt: ' ,txtNum[currentTxtNum])
                    difference = body.textNum - txtNum[currentTxtNum]
                    getSpecificText(difference)
                }
            })
    }
}
async function getSpecificText(difference) {
    var stext = []
    var sperson = []
    var send2 = []
    for (i = 0; i < difference; i++) {
        send1 = txtNum[currentTxtNum] + i
        send2.push(send1)
    }
    data = {
        required: send2,
        chat: currentChat
    }
    const options = {//meta data for post
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/texts', options)//post data
        .then(response => response.json())// recives response
        .then((body) => {
            for (i = 0; i < body.required.length; i++) {
                stext.push(body.required[i].text)
            }
            for (i = 0; i < body.required.length; i++) {
                sperson.push(body.required[i].sender)
            }
            txtNum[currentTxtNum] =  txtNum[currentTxtNum] + body.required.length
            
            addNewMessageToHtml(body.chat, stext, sperson)
        })
}
//=======================================serverPutData
async function putUserOutgoingTexts(info) {
    /*sends data to server
     and recives*/
    txtNum[currentTxtNum] += 1
    info[0] = info[0].trim()//removes white space
    info = info[0]//removes array from string
    date = new Date();//sets a new time
    CTime = date.getTime()
    data = {
        text: info,
        time: CTime,
        chat: currentChat
    };
    const options = {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/texts', options);
    const json = await response.json();
};
//=======================================serverGetDataOnLoad
async function getAllChatsAndTexts() {
    person = []
    data = { required: 'all' }
    const options = {//meta data for post
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/texts', options);//post data
    const json = await response.json();// recives response
    //display chat
    userChats = json.collections
    json.collections.forEach((element, i, arr) => {
        displayAllChatsInMenu(element, i)
    });
    //
    json.collections.forEach((element1, i1) => {
        var SMSG2 = []
        json.data[i1].forEach((element, i) => {
            SMSG2.push(json.data[i1][i].text)
        })
        json.data[i1].forEach((element, i) => {
            person.push(json.data[i1][i].sender)
        })
        displayAllServerMessages(element1, SMSG2, person)
        txtNum.push(SMSG2.length)
    })

    getSettings()
}; 
//=======================================displayChat
function displayAChat(current, index){
    // displays chat pressed
    userChats.forEach((element)=>{
        document.getElementById(element + 'Anchor').style.display = "none";
    })
    document.getElementById(current + 'Anchor').style.display = "block";
    document.getElementById('chatTitle').innerHTML = current
    currentChat =  current;
    currentTxtNum = index
    document.getElementById('chatMenu').style.display = 'none'
    document.getElementById('messageInputFeild').style.display = 'flex'
    document.getElementById('tip1').style.display = 'none'
}
//=======================================displayAllChatsInMenu
function displayAllChatsInMenu(chat, index){
    // displays all chats
    var div = document.createElement('div');
    div.setAttribute('class','chatFuncButton')
    div.innerHTML = '<div onclick="displayAChat(\'' + chat + '\',' + index + ')">' + chat + '</div>'
    document.getElementById("topchat").appendChild(div);
}
//=======================================displayServerMessage
function displayAllServerMessages(chat, text, sender){
    /*displays message procesed
     by serverGetDataOnLoad()*/
     var parentDiv = document.createElement("div")
     parentDiv.id = chat + 'Anchor'
     parentDiv.style.display = "none"
     document.getElementById("message").appendChild(parentDiv);
    text.forEach((element, i) =>{
        var div = document.createElement("div");
        div.innerHTML = '<span class="textSenderName">' + sender[i] + '- ' + '</span>'  + text[i];
        div.setAttribute('class', 'text')
        document.getElementById(parentDiv.id).appendChild(div);
        div.scrollIntoView();
    })    
};
//=======================================sAjaxInputMessage
function addNewMessageToHtml(chat, text, sender){
    //adds ajax messages
    console.log('sajax executed')
    messageSound.play()
    for (i = 0; i < text.length; i++){
    var div = document.createElement("div")
    div.innerHTML = '<span class="textSenderName">' + sender[i] + '- ' + '</span>'+ text[i];
    div.setAttribute('class', 'text')
    document.getElementById(chat + 'Anchor').appendChild(div);   
    div.scrollIntoView();
    } 
}
//=======================================inputMessage
function displayAndSendOutGoingMessage(){
    //adds messages in input
    var J = []
    let R = "";
    let inputValue = document.getElementById("input").value;
    if (inputValue !== "" && inputValue.trim().length !== 0 && inputValue.includes("<") !== true && inputValue.includes(">") !== true ){
        //inputValue = inputValue.replace(/<|>/g, " ");
        let div = document.createElement("div")
        div.innerHTML = '<span style="color:#63caec; float:left;">'+ 'you- ' + '</span>' + inputValue;
        div.setAttribute('class', 'text')
        document.getElementById(currentChat + 'Anchor').appendChild(div);
        div.scrollIntoView();
        document.getElementById("input").value = "";
        J.push(inputValue);
        putUserOutgoingTexts(J);
        document.getElementById('input').focus();
    }
    else if (inputValue.includes("<") == true || inputValue.includes(">") == true ){
        alert('please do not use < or > characters')
    }
};
//=======================================_EnterKey
function sendMessageWhenEnterKeyPressed(event){
    /* when "enter" key is pressed 
    make inputMessage() happen*/
    let X = event.keyCode;
    if (X == 13){
        displayAndSendOutGoingMessage();
        event.preventDefault();
    };
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================setinterval functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
setInterval(getChatSize, 1500);
setInterval(postUserToken, 5000);
postUserToken()//sends id as soon as load instead of waiting 5s
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================style functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================openCloseSettingsMenu
function openCloseSettingsMenu(arg){
    if (arg === 'open'){//opens settings
    document.getElementById('uiWrapper').style.display = "none";
    document.getElementById('all_settings').style.display = "block";
    document.getElementById('chatMenu').style.display = "none";
    } else if (arg === 'close'){
    document.getElementById('uiWrapper').style.display = "block";
    document.getElementById('all_settings').style.display = "none";
    document.getElementById('chatMenu').style.display = "none";
    }
}
function openCloseChatMenu(arg){
    if (arg === 'open'){//opens settings
    document.getElementById('chatMenu').style.display = "block";
    document.getElementById("chatMenu").focus()
    } else if (arg === 'close'){
    document.getElementById('chatMenu').style.display = "none";
    }
}
//=======================================selectAndPostValueOfTheme
function selectAndPostValueOfTheme(){
    var themesetting =  document.getElementById('themesetting').value
    selectTheme(themesetting)
    postChangedSettings(themesetting)
}
//=======================================selectTheme
function selectTheme(themeint){
    //selects from multiple themes
    ti = themeint.toString()
    let root = document.documentElement;
    document.getElementById('themesetting').value = ti
    switch (ti){
        case '1':
            //black
            root.style.setProperty('--bodyColor', "rgb(20, 20, 20)");
            root.style.setProperty('--textColor', "white");
            root.style.setProperty('--hamburgerColor', "brightness(100%)");
            root.style.setProperty('--textareaColor', "rgb(20, 20, 20)");
            root.style.setProperty('--buttonColor', "rgb(20, 20, 20)");
            root.style.setProperty('--textareaAbuttonTextColor', "white");
            root.style.setProperty('--yellowColor', "rgb(238, 241, 35);");
            root.style.setProperty('--lineColor', "white");
            root.style.setProperty('--greenColor', "#52fb9e");
            root.style.setProperty('--topBarColor', 'rgb(30,30,30)')
            break;
        case '2':
            //gray
            root.style.setProperty('--bodyColor', "rgb(56, 56, 56)");
            root.style.setProperty('--textColor', "white");
            root.style.setProperty('--hamburgerColor', "brightness(100%)");
            root.style.setProperty('--textareaColor', "rgb(56, 56, 56)");
            root.style.setProperty('--buttonColor', "rgb(56, 56, 56)");
            root.style.setProperty('--textareaAbuttonTextColor', "white");
            root.style.setProperty('--yellowColor', "rgb(238, 241, 35);");
            root.style.setProperty('--lineColor', "white");
            root.style.setProperty('--greenColor', "#52fb9e");
            root.style.setProperty('--topBarColor', 'rgb(70,70,70)')
        break;
        case '3':
            //white
            root.style.setProperty('--bodyColor', "white");
            root.style.setProperty('--textColor', "rgb(56, 56, 56)");
            root.style.setProperty('--hamburgerColor', "brightness(30%)");
            root.style.setProperty('--textareaColor', "white");
            root.style.setProperty('--buttonColor', "white");
            root.style.setProperty('--textareaAbuttonTextColor', "rgb(56, 56, 56)");
            root.style.setProperty('--yellowColor', "rgb(196, 199, 0);");
            root.style.setProperty('--lineColor', "black");
            root.style.setProperty('--greenColor', "#0bdc12");
            root.style.setProperty('--topBarColor', 'rgb(200,200,200)')
    }
}
function loadstop(){
    document.getElementById("loadimg").style.display="none";
}