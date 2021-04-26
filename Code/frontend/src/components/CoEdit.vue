<template>
    <div class="ide-canvas">
        <div ref="editor" style="width:100%;height:100%;float:left;"></div>
    </div>
</template>>

<script>

import IdManager from "@/utils/lib.js"

// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
// import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js'

export default {
    data () {
        return {
            editor: {},
            fontSize: 16,
            websocket: null,
            timestamp: 0,
            id: 0,
            signature: "", //signature is composed of (id, timestamp)
            uid: "",
        }
    },

    methods: {
        getTimeStamp() {
            this.timeStamp++
            return this.timeStamp
        },

        setTimeStamp (timeStamp) {
            this.timeStamp = timeStamp
        },

        updateTimeStamp (newTimeStamp) {
            if (newTimeStamp > this.timeStamp) this.timeStamp = newTimeStamp
        },
        
        getId () {
            this.id++
            return this.id
        },
    },

    mounted() {
        const _this = this
        this.$axios.post("/api/codemonitor/", {usertype: "student"}).then(
            (response) =>{
                console.log(response.data)
                this.uid = response.data
            }
        )
        this.editor = monaco.editor.create(this.$refs.editor, {
            value: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
            readOnly: false,
            language: "cpp",
            theme: 'vs-light',
            fontSize: this.fontSize,
            folding: true,
        })
        this.editor.getModel().onDidChangeContent((event)=>{
            console.log("change content")
            console.log(event)
            console.log(this.editor.getValue())
            this.websocket.send(this.editor.getValue())
        })
    },
    created() {
        let websocket = new WebSocket('ws://localhost:8000/ws/code/')
        this.websocket = websocket
    },
    computed() {

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
</style>