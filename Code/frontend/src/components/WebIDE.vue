<template>
<div class="ide-canvas" style="height:100%;width:100%">
        <div class="editor-top-bar" style="width:100%;height:auto;float:left;">
            <el-select v-model="language" @change="onLangChange" style="height:30px;float:right;">
                <Option v-for="item in languages" :key="item" :value="item">{{item}}
                </Option>
            </el-select>
            <div class="editor-tab">
                <span style="float:left;font-family:arial;color:grey;font-size:14px;">代码</span>
            </div>
        </div>
    <div id="container" style="width:100%;height:65%">
        <div id="editor-container" style="width:100%;height:70%;float:left;">
            <!-- <el-select v-model="language" @change="onLangChange">
            <Option v-for="item in languages" :key="item" :value="item">{{item}}
            </Option>
            </el-select> -->
            <codemirror
                style="font-size:16px;"
                ref="cmEditor"
                :value="code"
                :options="cmOptions"
                @ready="onCmReady"
                @focus="onCmFocus"
                @input="onCmCodeChange"
            />
        </div>
        <div class="editor-top-bar" style="width:50%;height:auto;float:left;">
            <div class="editor-tab">
                <span style="float:left;font-family:arial;color:grey;font-size:14px;">输入</span>
            </div>
        </div>
        <div class="editor-top-bar" style="width:50%;height:auto;float:left;">
            <div class="editor-tab" style="float:left;">
                <span style="float:left;font-family:arial;color:grey;font-size:14px;">输出</span>
            </div>
            <el-button id="submitButton" size="small" v-on:click="submit" style="height:auto;float:right;">编译运行</el-button>
        </div>
        <div id="input-container" style="width:50%;height:30%;float:left;">
            <codemirror
                style="font-size:13px;"
                ref="cinEditor"
                :value="blank"
                :options="cinOptions"
            />
        </div>
        <div id="output-container" style="width:50%;height:30%;float:left;">
            <codemirror
                style="font-size:13px;"
                ref="coutEditor"
                :value="blank"
                :options="coutOptions"
            />
        </div>
            <!-- <el-button v-on:click="submitCin">输入</el-button> -->
        <!-- <div id="terminal-container" style="width:600px;">
            <div id="terminal" style="width:600px;"></div>
        </div> -->
        <!-- <el-button v-on:click="submit">提交代码</el-button>
        <h4>运行结果</h4>
        <p class="paragraph">{{ result }}</p> -->
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

// import { codemirror } from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// themes
// import "codemirror/theme/ayu-mirage.css"
// import "codemirror/theme/ambiance.css"
// import "codemirror/theme/monokai.css"
// import "codemirror/theme/solarized.css"
// languages
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/javascript/javascript.js'
// active-line.js
// import 'codemirror/addon/selection/active-line.js'
// foldGutter
// import 'codemirror/addon/fold/foldgutter.css'
// import 'codemirror/addon/fold/foldgutter.js'
// import 'codemirror/addon/fold/brace-fold.js'
// import 'codemirror/addon/fold/indent-fold.js'
// import "codemirror/addon/hint/show-hint.css"
// import "codemirror/addon/hint/show-hint.js"

// import $ from 'jquery'

export default {
    name: "CodeMirror",
    components:{
        codemirror
    },
    props: {
    //   code: {
    //     type: String,
    //     default: 'const a = 10'
    //   },
      languages: {
        type: Array,
        default: () => {
          return ['C++', 'Python3']
        }
      },
      language: {
        type: String,
        default: 'C++'
      },
      theme: {
        type: String,
        default: 'ayu-mirage'
      }
    },
    data () {
        return {
            term: null,
            socket: null,
            // result: ' ',
            // submitButtonStatus: false,
            code: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
            blank: "",
            cmOptions:{
                tabSize: 4,
                // mode: 'C++',
                mode: 'text/x-c++src',
                // theme: 'monokai',
                // theme: 'ayu-mirage', 
                theme: 'default',  
                lineNumbers: true,
                line: true, 
                // 代码折叠
                foldGutter: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                // 选中文本自动高亮，及高亮方式
                styleSelectedText: true,
                lineWrapping: true,
                matchBrackets: true,
                highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
                indentWithTabs: true,
                smartIndent: true,
                indentUnit:4,
                styleActiveLine: true,       // 当前行背景高亮
            },
            cinOptions:{
                tabSize: 4,
                mode: 'text',
                // theme: 'monokai', 
                // theme: 'ayu-mirage',
                theme: 'default',
                lineNumbers: true,
                line: true, 
            },
            coutOptions:{
                tabSize: 4,
                mode: 'text',
                // theme: 'monokai',
                // theme: 'ayu-mirage',
                theme: 'default',
                lineNumbers: true,
                line: true, 
                readOnly: true,
            }
        }
    },
    methods: {
        // tryws() {
        //     this.socket.send("hi")
        // },
        onCmReady(cm) {
        console.log('the editor is readied!', cm)
        },
        onCmFocus(cm) {
        console.log('the editor is focused!', cm)
        },
        onCmCodeChange(newCode) {
        console.log('this is new code', newCode)
        this.code = newCode
        },
        onLangChange (newVal) {
            console.log(newVal)
            this.codemirror.setOption('mode', this.mode[newVal])
            // this.$emit('changeLang', newVal)
        },
        submit(){
            // $("submitButton").attr("disabled", true)
            // if(this.submitButtonStatus)
            // {
            //     return false;
            // }
            // this.submitButtonStatus = true
            let codeValue = this.codemirror.getValue()
            let cinValue = this.cinCodemirror.getValue()
            // console.log(cinValue)
            // console.log(codeValue)
            this.coutCodemirror.setValue("编译运行中...")
            // this.coutCodemirror.setValue("\x1B[1;3;31m编译运行中...\x1B[0m $")
            let url = "apis/api/code/"
            var _this = this
            // var timestamp = Date.parse(new Date())
            var timestamp = (new Date()).valueOf()
            console.log(timestamp)
            this.$axios.post(url, {code: codeValue, cin: cinValue, timestamp: timestamp})
            .then(function(res){
                console.log(res)
                // _this.result = res.data
                _this.coutCodemirror.setValue(res.data + '')
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
        codemirror() {
            return this.$refs.cmEditor.codemirror
        },
        cinCodemirror() {
            return this.$refs.cinEditor.codemirror
        },
        coutCodemirror() {
            return this.$refs.coutEditor.codemirror
        },
    },
    mounted() {
        const _this = this
        console.log('the current CodeMirror instance object:', this.codemirror)
        this.codemirror.setSize('auto', '500px')
        // this.codemirror.showHint()
        this.cinCodemirror.setSize('auto', '200px')
        this.coutCodemirror.setSize('auto', '200px')
        // let websocket = new WebSocket('ws://127.0.0.1:8000/ws/code/')
        // this.socket = websocket
        // you can use this.codemirror to do something...
        // let terminal = document.getElementById("terminal")
        // let term = new Terminal(
        //     {
        //         // cols: 92,
        //         // rows: 22,
        //         cursorBlink: true, // 光标闪烁
        //         cursorStyle: "underline", // 光标样式  null | 'block' | 'underline' | 'bar'
        //         // scrollback: 800, //回滚
        //         // tabStopWidth: 8, //制表宽度
        //         // screenKeys: true //
        //         disableStdin: false,
        //         theme: {
        //             foreground: "#7e9192", //字体
        //             background: "#002833", //背景色
        //             cursor: "help", //设置光标
        //             lineHeight: 16
        //         }
        //     }
        // )
        // term.open(terminal, true)
        // var fitAddon = new FitAddon()
        // term.loadAddon(fitAddon)
        // fitAddon.fit()
        // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
        // term.onData(function(key) {
        //     let order = {
        //         Data: key,
        //         Op: "stdin"
        //     };
        //     console.log(order)
        //     websocket.send(new TextEncoder().encode("\x00" + order))
        // })

        // // Vue.use(VueNativeSock, 'ws://localhost:8000/ws/code/')
        // if(typeof(WebSocket) === "undefined"){
        //     alert("您的浏览器不支持socket")
        // }else{
        //     // this.socket = new WebSocket('ws://127.0.0.1:8000/ws/code/')
        // }
        
        // let websocket = new WebSocket('ws://127.0.0.1:8000/ws/code/')
        // // this.socket = new WebSocket('ws://127.0.0.1:8000/ws/code/')
        // websocket.binaryType = "arraybuffer";
        // // this.socket.binaryType = "arraybuffer"

        // websocket.onopen = function(event) {
        //     console.log("onopen", event);
        //     term.writeln(
        //         "******************************************************************"
        //     );
        // };

        // websocket.onclose = function(e) {
        //     console.error('Code socket closed unexpectedly');
        // };
        //输入
        // term.on("data", function(data) {
        //     console.log("data", data);
        //     websocket.send(new TextEncoder().encode("\x00" + data));
        // });
        //错误
        // websocket.onerror = function(event) {
        //     console.log("error", event);
        // };

    }
}
</script>

<style scoped>
    .ide-canvas {
        margin: 0;
        margin-top: 0px;
        margin-right: 0px;
        margin-bottom: 0px;
        margin-left: 0px;
        /* background-color: black; */
    }
    .ide-canvas .editor-top-bar {
        background-color: #ececec;
    }
    .ide-canvas .editor-top-bar .editor-tab {
        width: 60px;
        height: 35px;
        line-height: 35px;
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
</style>
