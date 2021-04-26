<template>
<div class="ide-canvas">
    <el-button type="text" @click="revealCodeShare">查看教师代码分享</el-button>
    <!-- <el-drawer
        title="我嵌套了表格!"
        :visible.sync="codeShare"
        direction="rtl"
        size="50%">
        <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
        </el-table>
    </el-drawer> -->
    <el-drawer
        title="这里是教师分享的代码"
        :visible.sync="codeShare"
        direction="rtl"
        @open="init()"
        size="70%">
        <div ref="codeShareEditor" style="width:100%;height:100%;float:left;"></div>
    <!-- <div style="background-color: black; width: 100%; height: 100%;"></div> -->
    </el-drawer>
    <!-- <div class="ide-canvas" onselectstart="return false">
        <div ref="editor" style="width:100%;height:100%;float:left;"></div>
    </div> -->
</div>
</template>

<script>
export default {
    data() {
        return {
            codeShareEditor: null,
            codeShare: false,
            dialog: false,
        }
    },
    methods: {
        init() {
            console.log("init")
            this.$nextTick(()=>{
                console.log("init...", this)
                this.codeShareEditor = monaco.editor.create(this.$refs.codeShareEditor, {
                    value:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(void) {\n\n\treturn 0;\n}",
                    readOnly: true,
                    theme: "vs-light",
                    language: "cpp",
                    fontSize: 16,
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
        revealCodeShare() {
            console.log("revealCodeShare...");
            this.codeShare = true;
            console.log(this.codeShareEditor.getValue())
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
    },
    mounted() {
        
    }, 
    created() {

    }
}
</script>

<style scoped>
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
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>