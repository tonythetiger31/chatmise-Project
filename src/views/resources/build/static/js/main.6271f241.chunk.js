(this["webpackJsonpchatmise-react-frontend"]=this["webpackJsonpchatmise-react-frontend"]||[]).push([[0],{73:function(t,e,n){},74:function(t,e,n){"use strict";n.r(e);var a=n(1),s=n.n(a),r=n(35),i=n.n(r),c=n(7),o=n(8),u=n(14),h=n(10),l=n(9),d=n(0),j=function(t){Object(h.a)(n,t);var e=Object(l.a)(n);function n(t){var a;return Object(c.a)(this,n),(a=e.call(this)).textInput=s.a.createRef(),a.messageView=s.a.createRef(),a.scrollBehavior={scrollBehavior:"auto"},a}return Object(o.a)(n,[{key:"handleNewMessage",value:function(){if(""!==this.textInput.current.value){this.scrollBehavior={scrollBehavior:"smooth"};var t={text:this.textInput.current.value};this.props.action(t),this.textInput.current.value="",this.textInput.current.placeholder="type a message here"}else this.textInput.current.placeholder="that was an empty message :("}},{key:"enterKeyEvent",value:function(t){13==t.keyCode&&(this.handleNewMessage(),t.preventDefault())}},{key:"componentDidMount",value:function(){this.oldProps=this.props.data,this.messageView.current.lastChild.scrollIntoView()}},{key:"componentDidUpdate",value:function(){this.messageView.current.lastChild.scrollIntoView()}},{key:"render",value:function(){var t=this;function e(t){var e,n,a;return(t=new Date(t)).getHours()>12?(e="PM",n=t.getHours()-12):(e="AM",n=t.getHours()),a=t.getMinutes()<=9?"0":"",t.getMonth()+1+"/"+t.getDate()+"/"+t.getFullYear()+" "+n+":"+a+t.getMinutes()+" "+e}this.props.data===this.oldProps?this.scrollBehavior={scrollBehavior:"auto"}:this.oldProps=this.props.data;var n=this.props.data.map((function(t,n){return t.sender,Object(d.jsxs)("div",{className:"individualMessage",children:[Object(d.jsxs)("div",{className:"info",children:[Object(d.jsx)("span",{className:"sender",children:t.sender+" - "}),Object(d.jsx)("span",{className:"time",children:"  "+e(t.time)})]}),t.text]},n)}));return Object(d.jsxs)("div",{className:"TextsUi",children:[Object(d.jsx)("div",{className:"messagesView",ref:this.messageView,style:this.scrollBehavior,children:n}),Object(d.jsxs)("div",{className:"messageInputs",children:[Object(d.jsx)("textarea",{ref:this.textInput,onKeyDown:function(e){t.enterKeyEvent(e)},placeholder:"type a message here"}),Object(d.jsx)("button",{onClick:function(){t.handleNewMessage()},children:"Enter"})]})]})}}]),n}(s.a.Component),v=function(t){Object(h.a)(n,t);var e=Object(l.a)(n);function n(){return Object(c.a)(this,n),e.call(this)}return Object(o.a)(n,[{key:"render",value:function(){var t=this,e=this.props.data.map((function(e,n){return Object(d.jsx)("div",{className:"individualChat",onClick:function(){t.props.action(n)},children:e},n)}));return Object(d.jsx)("div",{className:"ChatMenu",children:e})}}]),n}(s.a.Component),p=function(t){Object(h.a)(n,t);var e=Object(l.a)(n);function n(){return Object(c.a)(this,n),e.call(this)}return Object(o.a)(n,[{key:"render",value:function(){return Object(d.jsx)("div",{className:"TopBar",children:Object(d.jsx)("div",{children:this.props.data})})}}]),n}(s.a.Component),b=n(36);console.log(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}));var O=Object(b.io)("/",{withCredentials:!0}),f=function(t){Object(h.a)(n,t);var e=Object(l.a)(n);function n(){var t;return Object(c.a)(this,n),(t=e.call(this)).state={texts:[[{time:3141592653,text:"Loading...",sender:"Loading..."}]],chats:["Loading..."],currentChat:0,user:"Loading"},t.changeCurrentChat=t.changeCurrentChat.bind(Object(u.a)(t)),t.addNewMessageToState=t.addNewMessageToState.bind(Object(u.a)(t)),t}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var t=this;O.on("allTexts",(function(e){"invalid credentials"!==e?(console.log(e),t.setState((function(t){return{chats:e.collections,texts:e.data,user:"oof"}}))):console.log("ERR Credentials Invalid")}))}},{key:"changeCurrentChat",value:function(t){this.setState({currentChat:t})}},{key:"addNewMessageToState",value:function(t){var e=this;this.setState((function(n){return{texts:n.texts.map((function(n,a){var s=n;return a===e.state.currentChat&&(s=n.concat([t])),s}))}})),O.emit("texts",{text:t.text,time:1612501270210,chat:this.state.chats[this.state.currentChat]})}},{key:"render",value:function(){var t=this;return Object(d.jsxs)("div",{className:"MainUi",children:[Object(d.jsx)(v,{action:function(e){t.changeCurrentChat(e)},data:this.state.chats}),Object(d.jsxs)("div",{className:"textsUiAndTopBarContainer",children:[Object(d.jsx)(p,{data:this.state.chats[this.state.currentChat]}),Object(d.jsx)(j,{action:function(e){t.addNewMessageToState(e)},data:this.state.texts[this.state.currentChat]})]})]})}}]),n}(s.a.Component);n(73);var x=function(){return Object(d.jsx)("div",{children:Object(d.jsx)(f,{})})},g=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,75)).then((function(e){var n=e.getCLS,a=e.getFID,s=e.getFCP,r=e.getLCP,i=e.getTTFB;n(t),a(t),s(t),r(t),i(t)}))};i.a.render(Object(d.jsx)(s.a.StrictMode,{children:Object(d.jsx)(x,{})}),document.getElementById("root")),g()}},[[74,1,2]]]);
//# sourceMappingURL=main.6271f241.chunk.js.map