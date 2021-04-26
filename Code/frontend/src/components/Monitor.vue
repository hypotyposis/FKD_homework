<template>
    <div class="ide-canvas">
        <el-drawer
        title="在这里编辑代码"
        :visible.sync="codeShare"
        direction="rtl"
        @open="initCodeShare()"
        @opened="buildCodeListener()"
        size="70%">
            <div ref="codeShareEditor" style="width:100%;height:100%;float:left;"></div>
        </el-drawer>    
        <div class="header" style="width:100%;height:5%;background-color: #ececec;border: 1px solid #ececec;">
            <div class="editor-tab" style="text-align:center;float:left;">
                <span style="font-family:arial;color:grey;font-size:14px;">{{  }}</span>
            </div>
            <el-button type="text" @click="revealCodeShare">向同伴共享代码</el-button>
            <div class="editor-tab" style="text-align:center;float:right;">
                <!-- <span id="websocketStatus" style="font-family:arial;{'color':statusColor};font-size:14px;">WebSocket: {{ websocketStatus }}</span> -->
                <span id="websocketStatus" style="font-family:arial;font-size:14px;" :style="{'color':statusColor}">WebSocket: {{ websocketStatus }}</span>
            </div>
        </div>
        <div class="main" style="width:100%;height:95%;">
            <div class="editor-container" style="width:85%;height:100%;float:left;">
                <div class="code-container" style="width:100%;height:80%;float:left;">
                    <div ref="editor" style="width:100%;height:100%;float:left;"></div>
                </div>
                <div style="width:100%;height:20%;float:left;">
                    <div class="cin-container" style="width:50%;height:100%;float:left;">
                        <div ref="cinEditor" style="width:100%;height:100%;float:left;"></div>
                    </div>
                    <div class="cout-container" style="width:50%;height:100%;float:right;">
                        <div ref="coutEditor" style="width:100%;height:100%;float:left;"></div>
                    </div>
                </div>
            </div>
            <div class="editor-container-sidebar" style="width:15%;height:100%;float:left;align-items:center;">
                <div class="namelist-container" style="width:100%;height:60%;align-items:center;overflow-y:auto">
                    <div class="namelist" 
                        v-for="student in students"
                        v-bind:student="student[0]"
                        v-bind:key="student[1]"
                    >
                        <el-button round type="primary" @click="chooseStudent(student[0])">teammate</el-button>
                    </div>
                </div>
                <!-- <div style="height:40%;width:90%;"><textarea id="textField" type="text" style="height:100%;width:100%;"></textarea></div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            uid: "",
            fontSize: 16,
            students: [],
            currentStudent:"",
            editor: null,
            cinEditor: null,
            coutEditor: null,
            lockReconnect: false,
            // timeout: 300000,
            timeoutObj: null,
            serverTimeoutObj: null,
            timeoutnum: null,
            websocketStatus: "",
            logMessage: "",
            statusColor: "green",
            codeShareEditor: null,
            codeShare: false,
            loading: false,
        }
    },

    methods: {
        initCodeShare() {
            console.log("init")
            this.$nextTick(()=>{
                if (this.codeShareEditor != null) return;
                console.log("nextTick...")
                this.codeShareEditor = monaco.editor.create(this.$refs.codeShareEditor, {
                    value:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
                    readOnly: false,
                    theme: "vs-light",
                    language: "cpp",
                    fontSize: 16,
                    automaticLayout: true,
                })      
            })
        },
        buildCodeListener() {
            this.codeShareEditor.getModel().onDidChangeContent((event)=>{
                console.log("change content")
                // console.log(event)
                console.log(this.codeShareEditor.getValue())
                let obj = {}
                obj.messageType = "codeShare"
                obj.uid = this.uid
                //base64加密代码内容
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
                obj.codeValue = Base64.encode(this.codeShareEditor.getValue())
                console.log("codeValue in Base64: ", obj.codeValue)
                // obj.codeValue = this.codeShareEditor.getValue()
                //!!!!!!!! 这样做发送的是change之前的光标位置！
                obj.posColumn = this.codeShareEditor.getPosition().column
                obj.posRow = this.codeShareEditor.getPosition().lineNumber
                // console.log(this.websocket.readyState)
                console.log(JSON.stringify(obj))
                this.websocket.send(JSON.stringify(obj))
                // this.websocket.send({data: this.monacoEditor.getValue(), posColumn: this.monacoEditor.getPosition().column, posRow: this.monacoEditor.getPosition().lineNumber})
            })
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

        updateLogMessage(message) {
            var timestamp = new Date().getTime();
            timestamp = new Date(timestamp).toLocaleString();
            this.logMessage = this.logMessage + timestamp + " " + message + "\n";
            // document.getElementById("textField").value = this.logMessage;
        },

        //setValue to the chooseStudent's data
        setValue(){
            const _this = this
            console.log("setValue...")
            console.log(this.students)
            for (var key in this.students)
            { 
                console.log(this.students[key][0])
                // console.log(this.currentStudent)
                if(this.students[key][0] == this.currentStudent)
                { 
                    console.log("yes!")
                    var data = this.students[key][1]
                    var cinData = this.students[key][2]
                    var coutData = this.students[key][3]
                    var x = this.students[key][4], y = this.students[key][5]
                    if (data != null)
                        this.editor.setValue(data)
                    else
                        this.editor.setValue("")
                    if (cinData != null)
                        this.cinEditor.setValue(cinData)
                    else
                        this.cinEditor.setValue("")
                    if (coutData != null)
                        this.coutEditor.setValue(coutData)
                    else
                        this.coutEditor.setValue("")
                    this.editor.setPosition({column: x, lineNumber: y})
                    console.log(this.editor.getPosition())
                }
            }
        },
        chooseStudent(value) {
            console.log("buttonValue:" + value)
            this.currentStudent = value
            this.setValue()
        },
        deleteButton(studentId){
            for(var key in this.students)
            {   
                console.log("deleting...")
                if(this.students[key][0] == studentId)
                { 
                    this.students.splice(key, 1) //delete the student
                    if (studentId == this.currentStudent)
                    {
                        this.editor.setValue("当前会话已关闭")
                        this.cinEditor.setValue("")
                        this.coutEditor.setValue("")
                    }
                    console.log("delete success!")
                    this.updateLogMessage(studentId + " " + "断开连接！")
                }
            }
        },
        initSocket() 
        {
            const _this = this;
            // let websocket = new WebSocket('ws://ide-ws.ac-code.com/ws/code/' + this.uid + '/')
            // let websocket = new WebSocket('ws://47.98.127.23:8000/ws/code/' + this.uid + '/')
            let websocket = new WebSocket('ws://ide-ws.hz.ac-code.com/ws/code/' + this.uid + '/')
            this.websocket = websocket
            this.websocket.onopen = function(event) {
                _this.$message.success("WebSocket 连接成功！")
                _this.startHeartbeat();
                _this.websocketStatus = "Connected";
                _this.statusColor = "green"
                _this.updateLogMessage("与服务器连接成功")
            }
            this.websocket.onmessage = function(event){
                console.log(event.data)
                if (event.data === "Heartbeat Checked")
                {
                    _this.resetHeartbeat();
                    return;
                }
                var data = JSON.parse(event.data);
                console.log(data)
                if (data.message === 'Close!')
                { 
                    console.log("Closing!")
                    console.log("uid:" + data.uid)
                    _this.deleteButton(data.uid)
                    return;
                }
                if (data.message === "new student link up!")
                {
                    console.log("new student link up!")
                    let obj = {}
                    obj.messageType = "codeShare"
                    obj.uid = _this.uid
                    if (_this.codeShareEditor)
                    {
                        obj.codeValue = _this.codeShareEditor.getValue()
                        //!!!!!!!! 这样做发送的是change之前的光标位置！
                        obj.posColumn = _this.codeShareEditor.getPosition().column
                        obj.posRow = _this.codeShareEditor.getPosition().lineNumber
                    }
                    else 
                    {
                        obj.codeValue = ""
                        //!!!!!!!! 这样做发送的是change之前的光标位置！
                        obj.posColumn = 0
                        obj.posRow = 0
                    }
                    // console.log(this.websocket.readyState)
                    console.log(JSON.stringify(obj))
                    _this.websocket.send(JSON.stringify(obj))
                    return;
                }
                data = JSON.parse(data.message)
                console.log(data)
                var studentId = data.uid
                var found = false;
                if (_this.students.length == 0)
                    _this.currentStudent = studentId;
                for (var key in _this.students)
                { 
                    if(_this.students[key][0] == studentId){
                        _this.students[key][1] = data.codeValue;
                        _this.students[key][2] = data.cinValue;
                        _this.students[key][3] = data.coutValue;
                        _this.students[key][4] = data.posColumn;
                        _this.students[key][5] = data.posRow;
                        console.log(_this.students)
                        found = true;
                        _this.setValue()
                        break;
                    }
                }
                if (found == false)
                {   
                    _this.updateLogMessage(studentId + " " + "连接了服务器")
                    _this.students.push([
                        studentId,
                        data.codeValue,
                        data.cinValue,
                        data.coutValue,
                        data.posColumn,
                        data.posRow,
                    ])
                    _this.setValue()
                }
                // for (var key in _this.students)
                //     console.log("student: " + _this.students[key])
                // console.log(_this.students)
                // for (var key in _this.students)
                //     console.log(key + "->" + _this.students[key])
            }
            this.websocket.onclose = function(event){
                console.log(event.code, event.reason, event.wasClean)
                _this.$message.error("WebSocket 连接已断开! ")
                _this.updateLogMessage("与服务器断开！！！")
                _this.websocketStatus = "Closed"
                // document.getElementById("websocketStatus").color = "red"
                _this.statusColor = "red"
                _this.reconnect()
            }
        },

        reconnect: function(){
            console.log("reconnecting...")
            this.updateLogMessage("正在重连...")
            const _this = this
            if (this.lockReconnect){
                return
            }
            this.lockReconnect = true
            this.timeoutnum && clearTimeout(this.timeoutnum)
            this.timeoutnum = setTimeout(function() {
                _this.initSocket()
                _this.lockReconnect = false
            }, 2000)
        },

        startHeartbeat() {
            // console.log('开启心跳');
            const _this = this;
            let _num = 1;
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

        resetHeartbeat() {
            // console.log('重置心跳');
            //清除时间
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            //重启心跳
            this.startHeartbeat();
        },

    },

    mounted() {
        this.editor = monaco.editor.create(this.$refs.editor, {
            value: "//此处显示同伴的代码",
            readOnly: true,
            language: "cpp",
            theme: 'vs-light',
            fontSize: this.fontSize,
            folding: true,
            automaticLayout: true,
        })
        this.cinEditor = monaco.editor.create(this.$refs.cinEditor, {
            value: "",
            readOnly: true,
            theme: 'vs-light',
            fontSize: 12,
            minimap: {
                enabled: false,
            },
        })
        this.coutEditor = monaco.editor.create(this.$refs.coutEditor, {
            value: "",
            readOnly: true,
            theme: 'vs-light',
            fontSize: 12,
            minimap: {
                enabled: false,
            },
        })
        document.getElementById("textField").value = "这里是日志消息"
    },

    created() {
        const _this = this
        new Promise((resolve, reject) =>{
            this.$axios.post("/api/codemonitor/", {usertype: "teacher"}).then(
                (response) =>{
                    console.log(response.data)
                    this.uid = response.data
                    resolve("solved")
                });
        }).then((response) =>{
            this.initSocket();
        })
    },
    destroyed() {
        this.websocket.close()
    }
}
</script>

<style scoped>
body {
  width: 100%;
  height: 100%;
  font-size: 18px;
  line-height: normal;
  margin: 0;
  padding: 0;
  /* background-color:#0e0d13; */
}
.header {
    /* display: flex;
    flex-direction: row; */
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
        /* display: flex; */
        /* flex-flow: column; */
        /* flex-direction: column; */
        /* background-color: black; */
    }
.editor-container-sidebar {
    width:20%;
    height:100%;
    float:left;
    display: flex;
    flex-flow: column;
    flex-direction: column;
    align-items:center;
}
.editor-tab {
    width: 15%;
    height: 100%;
    line-height: 30px;
    font-size: 14px;
    color: rgba(51,51,51,.7);
    background-color: white;
    border-right: 1px solid #f3f3f3;
}
.namelist-container {
    display: flex;
    flex-flow: column;
    flex-direction: column;
}
</style>