<template>
<div class="ide-canvas">
    <el-drawer
        title="这里是同伴分享的代码"
        :visible.sync="codeShare"
        direction="rtl"
        @open="initCodeShare()"
        @opened="buildCodeShare()"
        size="70%">
        <div ref="codeShareEditor" style="width:100%;height:100%;float:left;"></div>
    <!-- <div style="background-color: black; width: 100%; height: 100%;"></div> -->
    </el-drawer>
    <div class="editor-top-bar" style="width:100%;height:auto;float:left;display: flex;flex-direction: row;">
        <div class="editor-tab" style="text-align:center;">
            <span style="font-family:arial;color:grey;font-size:14px;">代码</span>
        </div>
        <!-- <el-button type="mini" @click="revealCodeShare">查看教师代码分享</el-button> -->
        <el-select size="mini" v-model="language" @change="onLangChange" style="height:30px;float:right;">
            <Option v-for="item in languages" :key="item" :value="item">{{item}}
            </Option>
        </el-select>
    </div>
    <div id="container" style="width:100%;height:70%">
        <div ref="monacoEditor" style="width:100%;height:100%;float:left;"></div>
        <div class="editor-top-bar" style="width:50%;height:auto;float:left;">
            <div class="editor-tab" style="float:left;text-align:center;">
                <span style="font-family:arial;color:grey;font-size:14px;">输入</span>
            </div>
        </div>
        <div class="editor-top-bar" style="width:50%;height:auto;float:left;">
            <div class="editor-tab" style="float:left;text-align:center;">
                <span style="font-family:arial;color:grey;font-size:14px;">输出</span>
            </div>
            <el-button id="submitButton" size="small" v-on:click="submit" style="height:auto;float:right;">编译运行</el-button>
        </div>
        <div id="input-container" style="width:50%;height:30%;float:left;">
            <div ref="cinEditor" style="width:100%;height:100%;float:left;"></div>
        </div>
        <div id="output-container" style="width:50%;height:30%;float:left;">
            <div ref="coutEditor" style="width:100%;height:100%;float:left;"></div>
        </div>
        <!-- <el-button @click="tryws">tryws</el-button> -->
    </div>
</div>   
</template>

<script>
// import 'xterm/css/xterm.css'
// import "xterm/lib/xterm.js"
// import { Terminal } from 'xterm'
// import { WebLinksAddon } from 'xterm-addon-web-links'
// import { FitAddon } from 'xterm-addon-fit'
// import * as fit from "xterm/lib/addons/fit/fit"
// Terminal.applyAddon(fit); // Apply the `fit` addon

// import Vue from 'vue'
// import { VueNativeSock } from 'vue-native-websocket'

// import * as monaco from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js'
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

export default {
    name: "CodeMirror",
    props: {
        language: {
            type: String,
            default: "C++",
        }
    },
    data () {
        return {
            monacoEditor: {},
            cinEditor: {},
            coutEditor: {},
            fontSize: 15, //monaco fontsize
            direction: '',
            uid: "",
            websocket: null,
            lockReconnect: false,
            // timeout: 300000,
            timeoutObj: null,
            serverTimeoutObj: null,
            timeoutnum: null,
            codeShareEditor: null,
            codeShare: false,
            loading: false,
            codeValueShared: "",
            posColumnShared: null,
            posRowShared: null,
        }
    },

    // watch: {
    //     socketStatus(value) {
    //         if(value !== 1)
    //         {   console.log(this.websocket.readyState)
    //             this.websocket = new WebSocket('ws://47.98.127.23:8000/ws/code/' + this.uid + '/')
    //             console.log(this.websocket.readyState)
    //         }
    //     }
    // },

    methods: {
        initCodeShare() {
            console.log("init")
            this.$nextTick(()=>{
                if (this.codeShareEditor != null) return;
                console.log("nextTick...")
                this.codeShareEditor = monaco.editor.create(this.$refs.codeShareEditor, {
                    // value:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
                    value: this.codeValueShared || "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
                    readOnly: true,
                    theme: "vs-light",
                    language: "cpp",
                    fontSize: 16,
                    automaticLayout: true,
                })
                this.codeShareEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => null);
                this.codeShareEditor.onDidChangeCursorSelection(
                    () => {
                        const { column, lineNumber } = this.codeShareEditor.getPosition();
                        console.log({column, lineNumber})
                        this.codeShareEditor.setPosition({ lineNumber, column });
                    },
                );
            })
        },
        buildCodeShare() {
            this.codeShareEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => {console.log("Ctrl C");return null;});
            this.codeShareEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_X, () => {console.log("Ctrl X");return null;});
            this.codeShareEditor.onDidChangeCursorSelection(
                () => {
                    const { column, lineNumber } = this.codeShareEditor.getPosition();
                    console.log({column, lineNumber})
                    this.codeShareEditor.setPosition({ lineNumber, column });
                },
            );
        },
        revealCodeShare() {
            console.log("revealCodeShare...");
            this.codeShare = true;
            // console.log(this.codeShareEditor.getValue())
        },
        handleClose(done) {
        if (this.loading) {
            return;
        }
        this.$confirm('确定要提交表单吗？')
            .then(_ => {
            this.loading = true;
            this.timer = setTimeout(() => {
                done();
                // 动画关闭需要一定的时间
                setTimeout(() => {
                this.loading = false;
                }, 400);
            }, 2000);
            })
            .catch(_ => {});
        },


        tryws() {
            console.log('close websocket')
            this.websocket.close()
        },

        initSocket() {
            const _this = this
            // let websocket = new WebSocket('ws://ide-ws.ac-code.com/ws/code/' + this.uid + '/')
            // let websocket = new WebSocket('ws://47.98.127.23:8000/ws/code/' + this.uid + '/')
            let websocket = new WebSocket('ws://ide-ws.hz.ac-code.com/ws/code/' + this.uid + '/')
            this.websocket = websocket
            this.websocket.onopen = function(event){
                console.log("websocket connected")
                // _this.$message.success("WebSocket 成功连接！");
                let obj = {}
                obj.uid = _this.uid
                obj.codeValue = _this.monacoEditor.getValue()
                obj.cinEditor = _this.cinEditor.getValue()
                obj.coutValue = _this.coutEditor.getValue()
                obj.posColumn = _this.monacoEditor.getPosition().column
                obj.posRow = _this.monacoEditor.getPosition().lineNumber
                console.log(JSON.stringify(obj))
                _this.websocket.send(JSON.stringify(obj))
                _this.startHeartbeat()
            }
            this.websocket.onclose = function(event){
                console.log(event.code, event.reason, event.wasClean)
                // _this.$message.error("WebSocket 连接已断开! ")
                _this.reconnect()
            }
            this.websocket.onmessage = function(event){
                console.log("accept ws message! ", event.data)
                if (event.data === "Heartbeat Checked")
                { 
                    _this.resetHeartbeat();
                    return;
                }
                var data = JSON.parse(event.data)
                if (data.message === "new teacher link up!"){
                    let obj = {}
                    obj.uid = _this.uid
                    obj.codeValue = _this.monacoEditor.getValue()
                    obj.cinValue = _this.cinEditor.getValue()
                    obj.coutValue = _this.coutEditor.getValue()
                    obj.posColumn = _this.monacoEditor.getPosition().column
                    obj.posRow = _this.monacoEditor.getPosition().lineNumber
                    console.log(JSON.stringify(obj))
                    _this.websocket.send(JSON.stringify(obj))
                    return;
                }
                var data = JSON.parse(data.message)
                if(data.messageType === "codeShare") {
                    console.log("receive code share message: ", data.codeValue)
                    //base64解密代码内容
                    let Base64 = {
                        encode(str) {
                            // first we use encodeURIComponent to get percent-encoded UTF-8,
                            // then we convert the percent encodings into raw bytes which
                            // can be fed into btoa.
                            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                                function toSolidBytes(match, p1) {
                                    return String.fromCharCode('0x' + p1);
                                }));
                        },
                        decode(str) {
                            // Going backwards: from bytestream, to percent-encoding, to original string.
                            return decodeURIComponent(atob(str).split('').map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join(''));
                        }
                    };
                    // _this.codeValueShared = data.codeValue
                    _this.codeValueShared = Base64.decode(data.codeValue)
                    _this.posColumnShared = data.posColumn
                    _this.posRowShared = data.posRow
                    if (_this.codeShareEditor != null)
                    {
                        _this.codeShareEditor.setValue(_this.codeValueShared)
                        _this.codeShareEditor.setPosition({column: _this.posColumnShared, lineNumber: _this.posRowShared})
                    }
                    // console.log(_this.codeShareEditor.getValue())
                }
            }
            this.websocket.onerror = function(event){
                console.log(_this.websocket.readyState)
                _this.reconnect()
            }
        },

        reconnect: function() {
            console.log("reconnecting...")
            const _this = this
            if (this.lockReconnect){
                return
            }
            this.lockReconnect = true
            this.timeoutnum && clearTimeout(this.timeoutnum)
            this.timeoutnum = setTimeout(function() {
                _this.initSocket()
                _this.lockReconnect = false
            }, 5000)
        },

        startHeartbeat(){
            // console.log('开启心跳');
            const _this = this;
            let _num = 3; //在几次连不上服务端后close并重连
            this.timeoutObj && clearTimeout(this.timeoutObj);
            this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
            this.timeoutObj = setTimeout(function(){
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                if (_this.websocket.readyState === 1) {
                    //如果连接正常
                    _this.websocket.send("Heartbeat Check");
                    // console.log("websocket is healthy")
                }
                else
                {   //否则重连
                    console.log("websocket is disconnected")
                    _this.reconnect();
                }
                _this.serverTimeoutObj = setTimeout(function() {
                    //超时关闭
                    _num--;
                    //计算答复的超时次数
                    if(_num === 0) {
                        _this.websocket.close();
                        // _this.reconnect();
                    }
                }, 5000);
            }, 5000)
        },

        resetHeartbeat(){
            // console.log('重置心跳');
            //清除时间
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            //重启心跳
            this.startHeartbeat();
        },

        changeFontSize (event) {
            // console.log(event)
            if(event.keyCode === 17){
                console.log("ctrl pressed")
                let options = {
                    scrollbar: {
                        alwaysConsumeMouseWheel: false,
                        handleMouseWheel: false,
                        // vertical: "hidden",
                    }
                }
                this.monacoEditor.updateOptions(options)
                // window.addEventListener('mousewheel', this.debounce(this.handleScroll,0), true)||window.addEventListener("DOMMouseScroll",this.debounce(this.handleScroll,0),false) 
                window.addEventListener('mousewheel', this.handleScroll, true, { passive: false }) //上一行的调用方式在remove监听器时出现问题
            }
            // 添加F8查看老师分享的代码快捷键
            if(event.keyCode === 121) {
                console.log("F10 pressed")
                if(this.codeShare === false)
                    this.revealCodeShare();
                else
                {
                    this.codeShare = false;
                }
            }
        },

        removeListener (event) {
            if (event.keyCode === 17)
            {
                console.log("ctrl unpressed")
                let options = {
                    scrollbar: {
                        alwaysConsumeMouseWheel: false,
                        handleMouseWheel: true,
                        // vertical: "hidden",
                    }
                }
                this.monacoEditor.updateOptions(options)
                window.removeEventListener('mousewheel', this.handleScroll, true, { passive : false})
                // window.removeEventListener('DOMMouseScroll', this.debounce(this.handleScroll,0), false)
                // window.removeEventListener('mousewheel', this.debounce(this.handleScroll,0), true)||window.addEventListener("DOMMouseScroll",this.debounce(this.handleScroll,0),false) 
            }
        },

        //函数防抖
        debounce(func, wait) {
            let timeout;
            return function () {
                let context = this;
                let args = arguments;
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(context, args)
                }, wait);
            }
        },

        handleScroll(event){
            console.log("handleScrolling...")
            // event.preventDefault();
            this.direction = event.deltaY > 0 ? 'down' : 'up'
            // console.log(this.direction)
            if(this.direction == 'down'){
                // console.log('scrollup')
                this.fontSize = this.fontSize - 0.5
                let options = {"fontSize": this.fontSize}
                this.monacoEditor.updateOptions(options)
            }else if(this.direction == "up"){
                // console.log('scrolldown')
                this.fontSize = this.fontSize + 0.5
                let options = {"fontSize": this.fontSize}
                this.monacoEditor.updateOptions(options)
            }
            event.preventDefault();
            // event.returnValue = false;
        },

        submit(){
            let codeValue = this.monacoEditor.getValue()
            console.log(codeValue)
            let cinValue = this.cinEditor.getValue()
            this.coutEditor.setValue("\x1B编译运行中...\x1B")
            let url = "/api/code/"
            var _this = this
            // var timestamp = Date.parse(new Date())
            var timestamp = (new Date()).valueOf()
            console.log(timestamp)
            this.$axios.post(url, {code: codeValue, cin: cinValue, timestamp: timestamp})
            .then(function(res){
                console.log(res)
                // _this.result = res.data
                _this.coutEditor.setValue(res.data + "")
            })
            .catch(function(error){
                console.log(error)
            })
            // this.submitButtonStatus = false
            // this.$axios.get(url)
            // .then(res=>{
            //     console.log(res.data)
            //     this.log = res.data
            //     return res.data
            // })
        },
        // submitCin() {
        //     let cinValue = this.cinCodemirror.getValue()
        //     console.log(cinValue)
        //     // var _this = this
        // },
    },
    computed: {
        socketStatus() {
            return this.websocket.readyState;
        }
    },
    created() {

        const _this = this
        new Promise((resolve, reject) =>{
            this.$axios.post("/api/codemonitor/", {usertype: "student"}).then(
                (response) =>{
                    console.log(response.data)
                    this.uid = response.data
                    resolve("solved")
                });
        }).then((response) =>{
                this.initSocket();
            }
        )
    },
    destroyed() {
        console.log("destroyed...");
        this.websocket.close()
        window.removeEventListener("keydown", this.changeFontSize)
        window.removeEventListener("keyup", this.removeListener)
    },
    mounted() {
        
        window.addEventListener('keydown', this.changeFontSize)
        window.addEventListener('keyup', this.removeListener)
        console.log("creating monacoEditor...")

        this.monacoEditor = monaco.editor.create(this.$refs.monacoEditor, {
            value: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
            readOnly: false,
            language: "cpp",
            theme: 'vs-light',
            fontSize: this.fontSize,
            folding: true,
            scrollbar: {
                alwaysConsumeMouseWheel: false,
                // handleMouseWheel: false,
                vertical: "hidden",
            },
            automaticLayout: true,
            // fontFamily: "",
            // width: 1200,
            // suggest: true,
        })

        this.monacoEditor.getModel().onDidChangeContent((event)=>{
            console.log("change content")
            console.log(event)
            console.log(this.monacoEditor.getValue())
            // this.websocket.send(this.monacoEditor.getValue())
            let obj = {}
            obj.uid = this.uid
            obj.codeValue = this.monacoEditor.getValue()
            obj.cinValue = this.cinEditor.getValue()
            obj.coutValue = this.coutEditor.getValue()
            //!!!!!!!! 这样做发送的是change之前的光标位置！
            obj.posColumn = this.monacoEditor.getPosition().column
            obj.posRow = this.monacoEditor.getPosition().lineNumber
            // console.log(this.websocket.readyState)
            console.log(JSON.stringify(obj))
            this.websocket.send(JSON.stringify(obj))
            // this.websocket.send({data: this.monacoEditor.getValue(), posColumn: this.monacoEditor.getPosition().column, posRow: this.monacoEditor.getPosition().lineNumber})
        })

        // this.cinEditor.getModel().onDidChangeContent((event)=>{
        //     console.log(this.cinEditor.getValue());
        // })

        var decorations = this.monacoEditor.deltaDecorations([], [
            { range: new monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
            { range: new monaco.Range(7,1,7,24), options: { inlineClassName: 'myInlineDecoration' }},
        ]);

        this.cinEditor = monaco.editor.create(this.$refs.cinEditor, {
            value:"",
            readOnly: false,
            theme: 'vs-light',
            fontSize: 14,
            minimap: {
                enabled: false,
            },
            automaticLayout: true,
            // lineNumbers: false,
        })

        this.cinEditor.getModel().onDidChangeContent((event)=>{
            console.log("change cin content")
            console.log(event)
            console.log(this.cinEditor.getValue())

            let obj = {};
            obj.uid = this.uid;
            obj.codeValue = this.monacoEditor.getValue()
            obj.cinValue = this.cinEditor.getValue()
            obj.coutValue = this.coutEditor.getValue()
            obj.posColumn = this.cinEditor.getPosition().column;
            obj.posRow = this.cinEditor.getPosition().lineNumber;
            console.log(JSON.stringify(obj))
            this.websocket.send(JSON.stringify(obj))
        })

        this.coutEditor = monaco.editor.create(this.$refs.coutEditor, {
            value:"",
            readOnly: true,
            theme: 'vs-light',
            fontSize: 14,
            minimap:{
                enabled: false,
            },
            automaticLayout: true,
            // lineNumbers: false,
        })

        this.coutEditor.getModel().onDidChangeContent((event)=>{
            console.log("change cout content")
            console.log(event)
            console.log(this.coutEditor.getValue())

            let obj = {};
            obj.uid = this.uid;
            obj.codeValue = this.monacoEditor.getValue();
            obj.cinValue = this.cinEditor.getValue();
            obj.coutValue = this.coutEditor.getValue();
            obj.posColumn = this.coutEditor.getPosition().column;
            obj.posRow = this.coutEditor.getPosition().lineNumber;
            console.log(JSON.stringify(obj))
            this.websocket.send(JSON.stringify(obj))
        })
    }
}
</script>


<style scoped>
 * { touch-action: none; }   
body {
  width: 100%;
  height: 100%;
  font-size: 18px;
  line-height: normal;
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* background-color:#0e0d13; */
}
    .ide-canvas {
        position: absolute;
        margin: 0;
        margin-top: 0px;
        margin-right: 0px;
        margin-bottom: 0px;
        margin-left: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column;
        flex-direction: column;
        /* background-color: black; */
    }
    .ide-canvas .editor-top-bar {
        background-color: #ececec;
    }
    .ide-canvas .editor-top-bar .editor-tab {
        width: 60px;
        height: 100%;
        line-height: 30px;
        font-size: 14px;
        color: rgba(51,51,51,.7);
        background-color: white;
        border-right: 1px solid #f3f3f3;
    }
    .paragraph {
        white-space:pre-wrap;
    }
    .CodeMirror * {
        font-family: Arial, monospace;
        font-size: 15px;
        line-height : 150%;
        /* height: auto !important; */
        width: 750px;
    }
    .CodeMirror-scroll {
        min-height: 300px;
        max-height: 1000px;
    }
    ::-webkit-scrollbar {
    width: .5rem;
    height: .5rem;
    /* background: hsla(0, 0%, 100%, 0.6); */
    background-color: rgb(14, 17, 32);
    /* color: rgb(45, 50, 77); */
    }

    ::-webkit-scrollbar-track {
    border-radius: 0;
    }

    ::-webkit-scrollbar-thumb {
    border-radius: 0;
    /* background-color: rgba(95,95,95,.4); */
    background-color: rgb(44, 50, 76);
    transition: all .2s;
    border-radius: .5rem;
    }
</style>
