/*contents
-authentication
-variable declerations
-functions
-setinterval functions
-style functions
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================Variables
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var Uid = Math.random()
var J = [];
var SMSG2 = [];
var SMSG1 = [];
var ot = undefined
var sa = true
var oy = true
var check
var date = new Date();
var themeStore
const currentUser = cookieParse(document.cookie, 'userId')
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================cookiepareser
function cookieParse(cookie, key){
    cA = cookie.split(/[;=]+/);
    cB = cA.indexOf(key) + 1
    cB = cA[cB]
    cB = cB.toString()
    return(cB)
}
//=======================================themePost
async function changeSettings(settingval){
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
function settheme(){
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
        themeselect(themetype)
    })
}
//=======================================logout
async function logout(){
    //logs user out
    const options = {
        method: 'delete',
    };
    const response = await fetch('/logout', options);
    const json = await response.json();
    location.replace("/login")
}
//=======================================useridsend
async function UserIdSend(){
    /*send user id to see how
     many users there are*/
    data = {string: currentUser};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
async function sajax(info){
    /*semi ajax to load user 
    messages*/
    var name = []
    var bruh = undefined
    pr = []
    SMSG1 = []
    last = []
    data = {string: info};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/texts', options);
    const json = await response.json();
    if (json.redirect == 'true'){
        location.replace('/login')
    }
    for (i = 0; i < json.length; i++){
        /*leaves only a array [] for each text
        , still multidementional*/
        SMSG1.push(json[i].time)
    }
    if (sa === true){
        ot = json
        sa = false
    } 
    if (oy === true){
        SMSG2 = SMSG1  
        oy = false
    }
    if (ot.length !== json.length && json[json.length -1].time != check){
        
        arr =   SMSG1.filter(x => SMSG2.indexOf(x) === -1)
        for(i = 0; i < arr.length; i++){
           pr.push(json.findIndex(x => x.time === arr[i]))
        }
        for(i = 0; i < pr.length; i++){
            bruh = pr[i]
            last.push(json[bruh].text)
        }
        for(i = 0; i < pr.length; i++){
            bruh = pr[i]
            name.push(json[bruh].sender)
        }
        sAjaxInputMessage(last, name) 
    }
    ot = json
    SMSG2 = SMSG1
}
//=======================================serverPostData
async function serverPostData(info){
    /*sends data to server
     and recives*/
    info[0] = info[0].trim()//removes white space
    info = info[0]//removes array from string
    date = new Date();//sets a new time
    CTime = date.getTime()
    data = {
        text: info,
        time: CTime,
        sender: currentUser
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }; 
    const response = await fetch('/texts', options);
    const json = await response.json();
    check = CTime
};
//=======================================serverPostDataOnLoad
    async function serverPostDataOnLoad(info){
        /*sends epmty string to 
        server and recives data*/
        person = []
        data = {string: info};
    const options = {//meta data for post
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/texts', options);//post data
    const json = await response.json();// recives response
    
    for (i = 0; i < json.length; i++){
            SMSG2.push(json[i].text)
    }
    for (i = 0; i < json.length; i++){  
        person.push(json[i].sender)
    }
    displayServerMessage(SMSG2, person)
    settheme()
}; 
//=======================================displayServerMessage
function displayServerMessage(text, sender){
    /*displays message procesed
     by serverPostDataOnLoad()*/
    for (i = 0; i < text.length; i++){
        var div = document.createElement("div");
        div.innerHTML = '<span class="textSenderName">' + sender[i] + '- ' + '</span>'  + text[i];
        div.setAttribute('class', 'text')
        document.getElementById("message").appendChild(div);
        div.scrollIntoView();
    } 
};
//=======================================sAjaxInputMessage
function sAjaxInputMessage(text, sender){
    //adds ajax messages
    for (i = 0; i < text.length; i++){
    var div = document.createElement("div")
    div.innerHTML = '<span class="textSenderName">' + sender[i] + '- ' + '</span>'+ text[i];
    div.setAttribute('class', 'text')
    document.getElementById("message").appendChild(div);   
    div.scrollIntoView();
    document.getElementById("myAudio").play();
    }
}
//=======================================inputMessage
function inputMessage(){
    //adds messages in input
    J = []
    let R = "";
    let inputValue = document.getElementById("input").value;
    if (inputValue !== "" && inputValue.trim().length !== 0 && inputValue.includes("<") !== true && inputValue.includes(">") !== true ){
        //inputValue = inputValue.replace(/<|>/g, " ");
        let div = document.createElement("div")
        div.innerHTML = '<span style="color:#63caec; float:left;">'+ 'you- ' + '</span>' + inputValue;
        div.setAttribute('class', 'text')
        document.getElementById("message").appendChild(div);
        div.scrollIntoView();
        document.getElementById("input").value = "";
        J.push(inputValue);
        serverPostData(J);
        document.getElementById('input').focus();
    }
    else if (inputValue.includes("<") == true || inputValue.includes(">") == true ){
        alert('please do not use < or > characters')
    }
};
//=======================================_EnterKey
function _EnterKey(event){
    /* when "enter" key is pressed 
    make inputMessage() happen*/
    let X = event.keyCode;
    if (X == 13){
        inputMessage();
        event.preventDefault();
    };
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================setinterval functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
setInterval(sajax, 1500);
setInterval(UserIdSend, 5000);
UserIdSend()//sends id as soon as load instead of waiting 5s
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=============================================================================style functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=======================================opensettings
function opensettings(){
    //opens settings
    document.getElementById('uiWrapper').style.display = "none";
    document.getElementById('all_settings').style.display = "block";
}
//=======================================closesettings
function closesettings(){
    //closes settings
    document.getElementById('uiWrapper').style.display = "block";
    document.getElementById('all_settings').style.display = "none";  
}
//=======================================passValOfTheme
function passValOfTheme(){
    var themesetting =  document.getElementById('themesetting').value
    themeselect(themesetting)
    changeSettings(themesetting)
}
//=======================================themeselect
function themeselect(themeint){
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
    }
}
