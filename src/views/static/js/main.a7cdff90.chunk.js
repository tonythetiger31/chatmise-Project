(this["webpackJsonpchatmise-react-frontend"]=this["webpackJsonpchatmise-react-frontend"]||[]).push([[0],{175:function(e,t,n){},176:function(e,t,n){"use strict";n.r(t),n.d(t,"DataContext",(function(){return L})),n.d(t,"socket",(function(){return H}));var r=n(3),a=n(6),c=n(5),o=n.n(c),i=n(12),s=n(2),u=n.n(s),l=n(57),d=n.n(l),b=n(58),j=n(13),h=n.n(j),m=n(18),g=n(0);var f=function(){return Object(g.jsx)("div",{className:"InternetWarning",children:"Connection error, please check your internet"})},x=function(e){return Object(g.jsx)("div",{className:"GrayBackground",onClick:function(){return e.exitPopUp()}})};function O(e){var t=e.time,n=[(t=new Date(t)).getHours(),t.getMinutes(),"AM"],r=n[0],a=n[1],c=n[2];r>12?(c="PM",r-=12):0===r&&(r=12),a<=9&&(a+="0");var o=[t.getMonth()+1,t.getDate(),t.getFullYear()],i=o[0],s=o[1],u=o[2];return Object(g.jsxs)("span",{className:"time",children:[i,"/",s,"/",u+" ",r,":",a+" "+c]})}function v(e){var t=Object(s.useContext)(L),n=t.appData,r=t.currentChat,a=n.texts[r];a||(a=[{time:0,text:"create a chat or ask a freind to invite you to theirs",sender:"server"}]);var c=Object(s.useRef)(null),o=Object(s.useRef)(null),i={};function u(){var t=function(){c.current.focus();var t={text:c.current.value,sender:n.username,time:(new Date).getTime()};e.sendAndDisplayMessage(t),c.current.value="",c.current.placeholder="type a message here"};""===c.current.value?c.current.placeholder="that was an empty message :(":h.a.contains(c.current.value,"\\")?alert("please don't use backslashes"):t()}Object(s.useEffect)((function(){i=a,o.current.lastChild.scrollIntoView(),c.current.focus()}),[]),Object(s.useEffect)((function(){a!==i&&a[0]===i[0]?(console.log("it worked!"),i=a,window.screen.width>760?o.current.lastChild.scrollIntoView({behavior:"smooth"}):o.current.lastChild.scrollIntoView()):o.current.lastChild.scrollIntoView()}),[e]);var l=a.map((function(e,t){var r=e.sender,a="othersMessage";return e.sender===n.username&&(r="you",a="yourMessage"),Object(g.jsxs)("div",{className:a,children:[Object(g.jsxs)("div",{className:"info",children:[Object(g.jsx)("span",{className:"sender",children:r+" - "}),Object(g.jsx)(O,{time:e.time})]}),e.text]},t)}));return Object(g.jsxs)("div",{className:"TextsUi",children:[Object(g.jsxs)("div",{className:"messagesView",ref:o,children:[l,Object(g.jsx)("div",{})]}),Object(g.jsxs)("div",{className:"messageInputs",children:[Object(g.jsx)("textarea",{onFocus:function(){o.current.lastChild.scrollIntoView()},maxLength:"170",ref:c,onKeyDown:function(e){!function(e){13==e.keyCode&&(u(),e.preventDefault())}(e)},placeholder:"type a message here"}),Object(g.jsx)("button",{onClick:function(){u()},children:"Send"})]})]})}function C(e){var t=Object(s.useContext)(L),n=t.appData,r=t.toggleComponent,a=n.chatNames.map((function(t,n){return Object(g.jsx)("div",{className:"individualChat",onClick:function(){e.changeCurrentChat(n)},children:t},n)}));return Object(g.jsxs)("div",{className:"ChatMenu",children:[Object(g.jsxs)("div",{className:"topBar",children:[Object(g.jsx)("a",{className:"exitButton",onClick:function(){return e.toggleChatMenu()}}),"Chats"]}),Object(g.jsx)("div",{className:"chats",children:a}),Object(g.jsx)("button",{className:"createChatButton",onClick:function(){return r("CreateChat")},children:"+"})]})}var p=n.p+"static/media/exit.05551b1a.svg",y=n.p+"static/media/hamburger.8d514b40.svg";function w(e){var t=Object(s.useContext)(L),n=t.appData,r=t.currentChat,a={content:"url(".concat(y,")")};a=e.HamburgerMenu?{content:"url(".concat(p,")")}:{content:"url(".concat(y,")")};return Object(g.jsxs)("div",{className:"TopBar",children:[Object(g.jsx)("a",{className:"chatButton",onClick:function(){return e.toggleChatMenu()}}),Object(g.jsx)("div",{children:n.chatNames[r]}),Object(g.jsx)("a",{className:"hamburgerButton",type:"button",onClick:function(){e.toggleHamburgerMenu()},style:a})]})}function k(e){var t=Object(s.useContext)(L),n=t.appData,r=t.currentChat,a=t.toggleComponent,c=t.toggleHamburgerMenu;function u(){return(u=Object(i.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:window.gapi.auth2.getAuthInstance().signOut().then((function(){console.log("User signed out."),e.setReload(!1),window.location="/home"}));case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var l=n.username===n.admins[r];return Object(g.jsxs)("div",{className:"HamburgerMenu",children:[Object(g.jsx)("a",{className:"exitButton",onClick:function(){return c()}}),Object(g.jsxs)("div",{className:"youAreLoggedInAs",children:["Logged in as ",n.username," "]}),l&&Object(g.jsxs)("div",{children:[Object(g.jsx)("button",{onClick:function(){return a("InviteMenu")},children:"Invite"}),Object(g.jsx)("br",{})]}),Object(g.jsx)("button",{onClick:function(){return a("ChatInfo")},children:"Chat Info"}),Object(g.jsx)("br",{}),Object(g.jsx)("button",{onClick:function(){return a("Settings")},children:"Settings"}),Object(g.jsx)("br",{}),Object(g.jsx)("button",{onClick:function(){return a("YourInvites")},children:"Your Invites"}),Object(g.jsx)("br",{}),Object(g.jsx)("button",{onClick:function(){return function(){return u.apply(this,arguments)}()},children:"Logout"}),Object(g.jsx)("br",{}),Object(g.jsxs)("div",{className:"links",children:[Object(g.jsx)("a",{href:"/home",onClick:function(){return e.setReload(!1)},children:"Home"}),Object(g.jsx)("pre",{children:" | "}),Object(g.jsx)("a",{href:"https://tipsandbugreport.netlify.app/",onClick:function(){return e.setReload(!1)},children:"Report Bug"})]})]})}var I=[{name:"black",bodyColor:"rgb(20, 20, 20)",contrastingBodyColor:"rgb(30, 30, 30)",textColor:"white",yellowColor:"rgb(196, 199, 0)",greenColor:"#52fb9e",darkGreenColor:"#36a568",greenTextColor:"#36ff90",blueColor:"#45daff",lineColor:"white",hamburgerColor:"brightness(100%)"},{name:"gray",bodyColor:"rgb(56, 56, 56)",contrastingBodyColor:"rgb(70,70,70)",textColor:"white",yellowColor:"rgb(238, 241, 35)",greenColor:"#52fb9e",greenTextColor:"#2de47f",darkGreenColor:"#36a568",blueColor:"rgb(99, 202, 236)",lineColor:"white",hamburgerColor:"brightness(100%)"},{name:"light gray",bodyColor:"#626262",contrastingBodyColor:"#6e6e6e",textColor:"white",placeholderColor:"#8d8c8c",yellowColor:"rgb(238, 241, 35)",greenColor:"#52fb9e",greenTextColor:"#52ff78",darkGreenColor:"#36a568",blueColor:"#65d9ff",lineColor:"white",hamburgerColor:"brightness(100%)"}];function N(e){var t=Object(s.useContext)(L).toggleComponent,n=I.map((function(e,t){return Object(g.jsx)("option",{value:t,children:e.name},t)}));return Object(g.jsxs)("div",{className:"Settings",children:[Object(g.jsx)("a",{type:"button",onClick:function(){return t("Settings")}}),Object(g.jsx)("div",{className:"title",children:"Settings"}),Object(g.jsx)("div",{children:"Theme"}),Object(g.jsx)("select",{value:e.theme,onChange:e.changeTheme,children:n})]})}function M(){var e=u.a.useContext(L).toggleComponent,t=Object(s.useRef)(null),n=Object(s.useRef)(null);function r(){var e=t.current.value;h.a.isAlphanumeric(e)?(H.emit("newChat",{chatName:t.current.value}),n.current.innerHTML="creating...",H.on("newChat",(function(e){200===e?(alert("successfully created"),window.location.reload()):400===e||500===e?alert("there was an error when creating your chat"):403===e&&alert("you already have already created the max of 5 chats"),n.current.innerHTML="CREATE"}))):alert("Chat name must be alphanumeric")}return Object(s.useEffect)((function(){t.current.focus()}),[]),Object(g.jsxs)("div",{className:"CreateChat",children:[Object(g.jsx)("a",{type:"button",onClick:function(){return e("CreateChat")}}),Object(g.jsx)("div",{className:"title",children:"Create Chat"}),Object(g.jsxs)("form",{onSubmit:function(e){r(),e.preventDefault()},children:[Object(g.jsx)("input",{placeholder:"Chat Name",maxLength:"10",minLength:"4",ref:t,required:!0,size:"15",onKeyDown:function(e){!function(e){32==e.keyCode&&e.preventDefault()}(e)}}),Object(g.jsx)("button",{ref:n,type:"submit",className:"Create",children:"Create"})]})]})}function T(){var e=Object(s.useContext)(L),t=e.appData,n=e.currentChat,r=e.toggleComponent,a=(e.render,t.members[n].map((function(e,n){return Object(g.jsxs)("div",{className:"members",children:[e===t.username?"You":e," ",Object(g.jsx)("br",{})]},n)}))),c=t.username===t.admins[n];return Object(g.jsxs)("div",{className:"ChatInfo",children:[Object(g.jsx)("a",{type:"button",onClick:function(){return r("ChatInfo")}}),Object(g.jsx)("div",{className:"title",children:"Chat Info"}),Object(g.jsxs)("div",{className:"subTitle",children:["admin:",Object(g.jsx)("span",{className:"adminInfo",children:c?"You":t.admins[n]})]}),Object(g.jsx)("div",{className:"subTitle",children:"members"}),Object(g.jsx)("div",{className:"info",children:a})]})}function S(){var e=Object(s.useContext)(L),t=e.appData,n=e.currentChat,r=e.toggleComponent,c=t.chatIds[n],o=Object(s.useState)(null),i=Object(a.a)(o,2),u=i[0],l=i[1],d=Object(s.useState)(null),b=Object(a.a)(d,2),j=(b[0],b[1]),m={backgroundColor:"var(--darkGreenColor)",color:"var(--textColor)"},f={backgroundColor:"var(--bodyColor)",color:"var(--textColor)"},x=Object(s.useRef)(null),O=Object(s.useRef)(null);function v(){var e=x.current.value,n=h.a.isLength(e,{min:0,max:10})&&h.a.isAlphanumeric(e);j((function(r){return e===r?l({text:"already tried that",color:{}}):e===t.username?l({text:"can't invite yourself",color:{}}):n?(H.emit("invite",{chatId:c,invitee:e}),l({text:"Sending...",color:f}),H.on("invite",(function(e){l(200===e?{text:"Invite Sent!",color:m}:404===e?{text:"user not found",color:{}}:409===e?{text:"user aleady invited",color:{}}:{text:"error",color:{}})}))):l({text:"Must be AlphaNumeric",color:{}}),e}))}return Object(s.useEffect)((function(){x.current.focus()}),[]),Object(g.jsxs)("div",{className:"InviteMenu",children:[Object(g.jsx)("a",{type:"button",onClick:function(){return r("InviteMenu")}}),Object(g.jsx)("div",{className:"title",children:"Invite"}),Object(g.jsx)("div",{className:"subTitle",children:"Invite your friends to this chat"}),Object(g.jsxs)("form",{className:"invite",onSubmit:function(e){e.preventDefault(),v()},children:[Object(g.jsx)("input",{ref:x,required:!0,placeholder:"Invite somone",size:"14",maxLength:"10"}),Object(g.jsx)("button",{type:"submit",ref:O,children:"Send"})]}),u&&Object(g.jsx)("div",{className:"message",style:u.color,children:u.text})]})}var B=n(59);function D(e){var t=Object(s.useContext)(L),n=t.appData,a=t.toggleComponent;function c(t,n){H.emit("acceptInvite",{chatId:n,isAccepted:t}),H.on("acceptInvite",(function(a){200!==a?alert("error",a):t?(alert("success"),window.location.reload()):t||e.setAppData((function(e){var t,a=[],c=Object(B.a)(e.invites);try{for(c.s();!(t=c.n()).done;)t.value._id!==n&&a.push()}catch(o){c.e(o)}finally{c.f()}return Object(r.a)(Object(r.a)({},e),{},{invites:a})}))}))}var o=n.invites.map((function(e,t){return console.log(e),Object(g.jsxs)("div",{className:"individualInvite",children:["".concat(e.admin," - ").concat(e.chatName," "),Object(g.jsx)("button",{className:"accept",onClick:function(){return c(!0,e._id)},children:"accept"}),Object(g.jsx)("button",{className:"decline",onClick:function(){return c(!1,e._id)},children:"decline"})]},t)}));return Object(g.jsxs)("div",{className:"YourInvites",children:[Object(g.jsx)("a",{onClick:function(){return a("YourInvites")}}),Object(g.jsx)("div",{className:"title",children:"Your Invites"}),0!==o.length?o:Object(g.jsx)("div",{className:"noInvites",children:"you have no invites"})]})}n(175);var H,R=n.p+"static/media/ping.6f864733.mp3",L=u.a.createContext();function A(){var e=Object(s.useState)({texts:[[{time:0,text:"Loading...",sender:"Loading..."}]],chatNames:["Loading..."],chatIds:["Loading..."],username:"Loading...",admins:["Loading..."],members:["Loading..."],invites:["Loading..."]}),t=Object(a.a)(e,2),n=t[0],c=t[1],u=function(){var e=window.screen.width<=760&&0===window.screen.orientation.angle,t=Object(s.useState)({InternetWarning:!1,ChatMenu:!0,RightContainer:!e,TobBar:!0,TextUi:!0,GrayBackground:!1,HamburgerMenu:!1,Settings:!1,CreateChat:!1,ChatInfo:!1,InviteMenu:!1,YourInvites:!1}),n=Object(a.a)(t,2),c=n[0],o=n[1];return[c,o,function(){o((function(t){var n=Object(r.a)(Object(r.a)({},c),{},{HamburgerMenu:!1,RightContainer:!0,ChatMenu:!0});return e?t.HamburgerMenu?(n.ChatMenu=!1,n.RightContainer=!0,n.TobBar=!0,n.TextUi=!0):(n.TextUi=!1,n.ChatMenu=!1,n.HamburgerMenu=!0,n.TobBar=!1):t.HamburgerMenu||(n.HamburgerMenu=!0),n}))},function(){o((function(e){return Object(r.a)(Object(r.a)({},c),{},{ChatMenu:!e.ChatMenu,RightContainer:e.ChatMenu})}))},function(e){o((function(t){var n;return Object(r.a)(Object(r.a)({},c),{},(n={},Object(m.a)(n,e,!t[e]),Object(m.a)(n,"GrayBackground",!t[e]),n))}))},function(){o((function(e){return Object(r.a)(Object(r.a)({},e),{},{GrayBackground:!1,Settings:!1,CreateChat:!1,ChatInfo:!1,InviteMenu:!1,YourInvites:!1})}))}]}(),l=Object(a.a)(u,6),d=l[0],b=l[1],j=l[2],h=l[3],O=l[4],p=l[5],y=Object(s.useState)(!1),B=Object(a.a)(y,2),A=B[0],Y=B[1],E=Object(s.useState)(0),G=Object(a.a)(E,2),U=G[0],V=G[1],q=Object(s.useState)(1),P=Object(a.a)(q,2),_=P[0],W=P[1],z=new Audio(R);Object(s.useEffect)(Object(i.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:H.on("allTexts",(function(e){500===e?console.log("server error"):"invalid credentials"!==e?(Y(!0),c(e),J(e.settings)):window.location="/home"})),H.on("texts",(function(e){F(e),"visible"!==document.visibilityState&&z.play()})),H.on("disconnect",(function(){b(Object(r.a)(Object(r.a)({},d),{},{InternetWarning:!0,GrayBackground:!0})),Y((function(e){return!0===e&&(console.log("reload"),window.location.reload()),e}))}));case 3:case"end":return e.stop()}}),e)}))),[]);function F(e){c((function(t){var n=U;e.chatId&&(n=t.chatIds.indexOf(e.chatId)),console.log({chatToAddTo:n,message:e});var a=t.texts.map((function(t,r){var a=t;return r===n&&(a=t.concat([e])),a}));return console.log({newTexts:a},t.texts),Object(r.a)(Object(r.a)({},t),{},{texts:a})}))}var J=function(e){try{var t=e.target.value;H.emit("settings",{settings:t})}catch(a){t=e}var n=Object.keys(I[t]),r=Object.values(I[t]);W(t),n.forEach((function(e,t){document.documentElement.style.setProperty("--".concat(e),r[t])}))};return Object(g.jsx)("div",{className:"App",children:A&&Object(g.jsxs)(L.Provider,{value:{appData:n,currentChat:U,toggleComponent:O,toggleHamburgerMenu:j,render:d},children:[d.GrayBackground&&Object(g.jsx)(x,{exitPopUp:p}),d.Settings&&Object(g.jsx)(N,{changeTheme:J,theme:_}),d.ChatMenu&&Object(g.jsx)(C,{changeCurrentChat:function(e){return function(e){window.screen.width<=760&&b(Object(r.a)(Object(r.a)({},d),{},{ChatMenu:!1,RightContainer:!0})),V(e)}(e)},toggleChatMenu:h}),d.ChatInfo&&Object(g.jsx)(T,{}),d.CreateChat&&Object(g.jsx)(M,{}),d.InviteMenu&&Object(g.jsx)(S,{}),d.YourInvites&&Object(g.jsx)(D,{setAppData:c}),d.InternetWarning&&Object(g.jsx)(f,{}),d.RightContainer&&Object(g.jsxs)("div",{className:"rightContainer",children:[d.TobBar&&Object(g.jsx)(w,{renHamburgerMenu:d.HamburgerMenu,toggleHamburgerMenu:j,toggleChatMenu:h}),d.HamburgerMenu&&Object(g.jsx)(k,{setReload:function(){Y()}}),d.TextUi&&Object(g.jsx)(v,{sendAndDisplayMessage:function(e){return F(t=e),void H.emit("texts",{text:t.text,time:t.time,chatId:n.chatIds[U]});var t}})]})]})})}window.gapi.load("client:auth2",Object(i.a)(o.a.mark((function e(){var t,n,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.gapi.auth2.init({client_id:"407415747373-v23ak1k7kp37k3s986mu5qh9cpqh9bdh.apps.googleusercontent.com"});case 2:t=e.sent,n=t.currentUser.get(),r=n.getAuthResponse().id_token,H=Object(b.io)("/",{withCredentials:!0,query:{token:r}}),d.a.render(Object(g.jsx)(u.a.StrictMode,{children:Object(g.jsx)(A,{})}),document.getElementById("root"));case 7:case"end":return e.stop()}}),e)}))))}},[[176,1,2]]]);
//# sourceMappingURL=main.a7cdff90.chunk.js.map