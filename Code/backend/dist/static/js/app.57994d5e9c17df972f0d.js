/*! For license information please see app.57994d5e9c17df972f0d.js.LICENSE */
webpackJsonp([2],{"+0Qw":function(t,e){},"+Tn7":function(t,e){},"0u1n":function(t,e){},"1O6n":function(t,e){},"3Oo0":function(t,e){},"4UgQ":function(t,e){},"4YMn":function(t,e){},"4Yhh":function(t,e){},"5RGO":function(t,e){},"5kgg":function(t,e){},"6nME":function(t,e){},"7Do+":function(t,e){},"84z/":function(t,e){},"8BNP":function(t,e){},"8EM9":function(t,e){},"9vcT":function(t,e){},"EG+O":function(t,e){},Eawl:function(t,e){},Gu5N:function(t,e){},KL86:function(t,e){},KU51:function(t,e){},"L/b2":function(t,e){},LC7R:function(t,e){},LCUL:function(t,e){},MfYP:function(t,e){},MlKm:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n("lRwf"),i=n.n(o),s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var a=n("VU/8")({name:"App"},s,!1,function(t){n("4YMn")},null,null).exports,c=n("pRNm"),l=n.n(c),r=n("mvHQ"),u=n.n(r),d=n("//Fk"),f=n.n(d),h=n("Ny4g"),m=(n("TFmH"),{name:"CodeMirror",props:{language:{type:String,default:"C++"}},data:function(){return{monacoEditor:{},cinEditor:{},coutEditor:{},fontSize:15,direction:"",uid:"",websocket:null}},methods:{tryws:function(){console.log("close websocket"),this.websocket.close()},changeFontSize:function(t){17===t.keyCode&&(console.log("ctrl pressed"),window.addEventListener("mousewheel",this.handleScroll,!0))},removeListener:function(t){17===t.keyCode&&(console.log("ctrl unpressed"),window.removeEventListener("mousewheel",this.handleScroll,!0))},debounce:function(t,e){var n=void 0;return function(){var o=this,i=arguments;n&&clearTimeout(n),n=setTimeout(function(){t.apply(o,i)},e)}},handleScroll:function(t){if(console.log("handleScrolling..."),this.direction=t.deltaY>0?"down":"up","down"==this.direction){this.fontSize=this.fontSize-.5;var e={fontSize:this.fontSize};this.monacoEditor.updateOptions(e)}else if("up"==this.direction){this.fontSize=this.fontSize+.5;var n={fontSize:this.fontSize};this.monacoEditor.updateOptions(n)}t.preventDefault()},submit:function(){var t=this.monacoEditor.getValue();console.log(t);var e=this.cinEditor.getValue();this.coutEditor.setValue("编译运行中...");var n=this,o=(new Date).valueOf();console.log(o),this.$axios.post("/api/code/",{code:t,cin:e,timestamp:o}).then(function(t){console.log(t),n.coutEditor.setValue(t.data+"")}).catch(function(t){console.log(t)})}},computed:{},created:function(){var t=this,e=this;new f.a(function(e,n){t.$axios.post("/api/codemonitor/",{usertype:"student"}).then(function(n){console.log(n.data),t.uid=n.data,e("solved")})}).then(function(n){var o=new WebSocket("ws://47.98.127.23:8000/ws/code/"+t.uid+"/");t.websocket=o,t.websocket.onopen=function(t){console.log("websocket connected");var n={};n.uid=e.uid,n.codeValue=e.monacoEditor.getValue(),n.posColumn=e.monacoEditor.getPosition().column,n.posRow=e.monacoEditor.getPosition().lineNumber,console.log(u()(n)),e.websocket.send(u()(n))},t.websocket.onclose=function(t){console.log(t.code,t.reason,t.wasClean)},t.websocket.onmessage=function(t){if(console.log("accept ws message!"),"new teacher link up!"===JSON.parse(t.data).message){var n={};n.uid=e.uid,n.codeValue=e.monacoEditor.getValue(),n.posColumn=e.monacoEditor.getPosition().column,n.posRow=e.monacoEditor.getPosition().lineNumber,console.log(u()(n)),e.websocket.send(u()(n))}}})},destroyed:function(){console.log("destroyed..."),this.websocket.close(),window.removeEventListener("keydown",this.changeFontSize),window.removeEventListener("keyup",this.removeListener)},mounted:function(){var t=this;window.addEventListener("keydown",this.changeFontSize),window.addEventListener("keyup",this.removeListener),console.log("creating monacoEditor..."),this.monacoEditor=h.b.create(this.$refs.monacoEditor,{value:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",readOnly:!1,language:"cpp",theme:"vs-light",fontSize:this.fontSize,folding:!0}),this.monacoEditor.getModel().onDidChangeContent(function(e){console.log("change content"),console.log(e),console.log(t.monacoEditor.getValue());var n={};n.uid=t.uid,n.codeValue=t.monacoEditor.getValue(),n.posColumn=t.monacoEditor.getPosition().column,n.posRow=t.monacoEditor.getPosition().lineNumber,console.log(u()(n)),t.websocket.send(u()(n))});this.monacoEditor.deltaDecorations([],[{range:new h.a(3,1,5,1),options:{isWholeLine:!0,linesDecorationsClassName:"myLineDecoration"}},{range:new h.a(7,1,7,24),options:{inlineClassName:"myInlineDecoration"}}]);this.cinEditor=h.b.create(this.$refs.cinEditor,{value:"",readOnly:!1,theme:"vs-light",fontSize:14,minimap:{enabled:!1}}),this.coutEditor=h.b.create(this.$refs.coutEditor,{value:"",readOnly:!0,theme:"vs-light",fontSize:14,minimap:{enabled:!1}})}}),g={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ide-canvas"},[n("div",{staticClass:"editor-top-bar",staticStyle:{width:"100%",height:"auto",float:"left"}},[n("el-select",{staticStyle:{height:"30px",float:"right"},on:{change:t.onLangChange},model:{value:t.language,callback:function(e){t.language=e},expression:"language"}},t._l(t.languages,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e)+"\n                ")])}),1),t._v(" "),t._m(0)],1),t._v(" "),n("div",{staticStyle:{width:"100%",height:"70%"},attrs:{id:"container"}},[n("div",{ref:"monacoEditor",staticStyle:{width:"100%",height:"100%",float:"left"}}),t._v(" "),t._m(1),t._v(" "),n("div",{staticClass:"editor-top-bar",staticStyle:{width:"50%",height:"auto",float:"left"}},[t._m(2),t._v(" "),n("el-button",{staticStyle:{height:"auto",float:"right"},attrs:{id:"submitButton",size:"small"},on:{click:t.submit}},[t._v("编译运行")])],1),t._v(" "),n("div",{staticStyle:{width:"50%",height:"30%",float:"left"},attrs:{id:"input-container"}},[n("div",{ref:"cinEditor",staticStyle:{width:"100%",height:"100%",float:"left"}})]),t._v(" "),n("div",{staticStyle:{width:"50%",height:"30%",float:"left"},attrs:{id:"output-container"}},[n("div",{ref:"coutEditor",staticStyle:{width:"100%",height:"100%",float:"left"}})])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"editor-tab",staticStyle:{"text-align":"center"}},[e("span",{staticStyle:{"font-family":"arial",color:"grey","font-size":"14px"}},[this._v("代码")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"editor-top-bar",staticStyle:{width:"50%",height:"auto",float:"left"}},[e("div",{staticClass:"editor-tab",staticStyle:{float:"left","text-align":"center"}},[e("span",{staticStyle:{"font-family":"arial",color:"grey","font-size":"14px"}},[this._v("输入")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"editor-tab",staticStyle:{float:"left","text-align":"center"}},[e("span",{staticStyle:{"font-family":"arial",color:"grey","font-size":"14px"}},[this._v("输出")])])}]};var p=n("VU/8")(m,g,!1,function(t){n("3Oo0")},"data-v-5eae7324",null).exports,v=n("Zrlr"),w=n.n(v),S=n("wxAW"),y=n.n(S),b=(function(){function t(){w()(this,t),this.id=0}y()(t,[{key:"getId",value:function(){return this.id++,this.id}}])}(),{data:function(){return{editor:{},fontSize:16,websocket:null,timestamp:0,id:0,signature:"",uid:""}},methods:{getTimeStamp:function(){return this.timeStamp++,this.timeStamp},setTimeStamp:function(t){this.timeStamp=t},updateTimeStamp:function(t){t>this.timeStamp&&(this.timeStamp=t)},getId:function(){return this.id++,this.id}},mounted:function(){var t=this;this.$axios.post("/api/codemonitor/",{usertype:"student"}).then(function(e){console.log(e.data),t.uid=e.data}),this.editor=monaco.editor.create(this.$refs.editor,{value:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",readOnly:!1,language:"cpp",theme:"vs-light",fontSize:this.fontSize,folding:!0}),this.editor.getModel().onDidChangeContent(function(e){console.log("change content"),console.log(e),console.log(t.editor.getValue()),t.websocket.send(t.editor.getValue())})},created:function(){var t=new WebSocket("ws://localhost:8000/ws/code/");this.websocket=t},computed:function(){}}),E={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"ide-canvas"},[e("div",{ref:"editor",staticStyle:{width:"100%",height:"100%",float:"left"}})])},staticRenderFns:[]};var k=n("VU/8")(b,E,!1,function(t){n("6nME")},"data-v-0b3e08f8",null).exports,C={data:function(){return{uid:"",fontSize:16,students:[],currentStudent:""}},methods:{setValue:function(){for(var t in console.log("setValue..."),this.students)if(console.log(this.students[t][0]),console.log(this.currentStudent),this.students[t][0]==this.currentStudent){console.log("yes!");var e=this.students[t][1],n=this.students[t][2],o=this.students[t][3];this.editor.setValue(e),this.editor.setPosition({column:n,lineNumber:o}),console.log(this.editor.getPosition())}},chooseStudent:function(t){console.log("buttonValue:"+t),this.currentStudent=t,this.setValue()},deleteButton:function(t){for(var e in this.students)console.log("deleting..."),this.students[e][0]==t&&(this.students.splice(e,1),this.editor.setValue("当前会话已关闭"),console.log("delete success!"))}},mounted:function(){this.editor=monaco.editor.create(this.$refs.editor,{value:"//此处显示学生的代码",readOnly:!0,language:"cpp",theme:"vs-light",fontSize:this.fontSize,folding:!0})},created:function(){var t=this,e=this;new f.a(function(e,n){t.$axios.post("/api/codemonitor/",{usertype:"teacher"}).then(function(n){console.log(n.data),t.uid=n.data,e("solved")})}).then(function(n){var o=new WebSocket("ws://47.98.127.23:8000/ws/code/"+t.uid+"/");t.websocket=o,t.websocket.onmessage=function(t){var n=JSON.parse(t.data);if(console.log(n),"Close!"===n.message)return console.log("Closing!"),console.log("uid:"+n.uid),void e.deleteButton(n.uid);n=JSON.parse(n.message),console.log(n);var o=n.uid,i=!1;for(var s in 0==e.students.length&&(e.currentStudent=o),e.students)if(e.students[s][0]==o){e.students[s][1]=n.codeValue,e.students[s][2]=n.posColumn,e.students[s][3]=n.posRow,console.log(e.students),i=!0,e.setValue();break}0==i&&(e.students.push([o,n.codeValue,n.posColumn,n.posRow]),e.setValue())},t.websocket.onclose=function(t){console.log(t.code,t.reason,t.wasClean)}})},destroyed:function(){this.websocket.close()}},_={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ide-canvas"},[n("div",{staticClass:"header",staticStyle:{width:"100%",height:"5%","background-color":"#ececec"}},[n("div",{staticClass:"editor-tab",staticStyle:{"text-align":"center"}},[n("span",{staticStyle:{"font-family":"arial",color:"grey","font-size":"14px"}},[t._v(t._s(t.currentStudent))])])]),t._v(" "),n("div",{staticClass:"main",staticStyle:{width:"100%",height:"95%"}},[n("div",{staticClass:"editor-container",staticStyle:{width:"80%",height:"100%",float:"left"}},[n("div",{ref:"editor",staticStyle:{width:"100%",height:"100%",float:"left"}})]),t._v(" "),n("div",{staticClass:"editor-container-sidebar",staticStyle:{width:"20%",height:"100%",float:"left","align-items":"center"}},t._l(t.students,function(e){return n("div",{key:e[1],staticClass:"namelist",attrs:{student:e[0]}},[n("el-button",{attrs:{round:"",type:"primary"},on:{click:function(n){return t.chooseStudent(e[0])}}},[t._v(t._s(e[0]))])],1)}),0)])])},staticRenderFns:[]};var x=n("VU/8")(C,_,!1,function(t){n("4UgQ")},"data-v-53435f90",null).exports;i.a.use(l.a);var V=new VueRouter({mode:"history",routes:[{path:"/",name:"Monaco",component:p},{path:"/edit",name:"CoEdit",component:k},{path:"/monitor",name:"Monitor",component:x}]}),z=n("OMN4"),N=n.n(z),O=n("l6IN"),L=n.n(O);i.a.use(L.a),i.a.prototype.$axios=N.a,N.a.defaults.xsrfHeaderName="X-CSRFToken",N.a.defaults.xsrfCookieName="csrftoken",i.a.config.productionTip=!1,window.MonacoEnvironment={getWorkerUrl:function(){return R}};var R=URL.createObjectURL(new Blob(["\n    self.MonacoEnvironment = {\n        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min'\n    };\n    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.min.js');\n"],{type:"text/cpp"}));new i.a({el:"#app",router:V,components:{App:a},template:"<App/>"})},OMN4:function(t,e){t.exports=axios},OkZj:function(t,e){},"R/+A":function(t,e){},XTA7:function(t,e){},byCY:function(t,e){},czDl:function(t,e){},gCdB:function(t,e){},gvGx:function(t,e){},"jF/U":function(t,e){},l6IN:function(t,e){t.exports=ELEMENT},lRwf:function(t,e){t.exports=Vue},nLHh:function(t,e){},nfAi:function(t,e){},pRNm:function(t,e){t.exports=VueRouter},rc56:function(t,e){},sOVj:function(t,e){},sOjV:function(t,e){},sZ3n:function(t,e){},uHSv:function(t,e){},wzEN:function(t,e){},x33M:function(t,e){}},["NHnr"]);