<template>
    <el-card class="box-card">
        <el-row :gutter="25">
            <el-col :span="5">
                <div>
                    <el-upload
                        class="upload-demo"
                        action="http://127.0.0.1:51002/cloud-file-service/upload/fileUpload"
                        :headers="myHeaders"
                        :data="{path: path}"
                        :before-upload="beforeUpload"
                        :on-progress="handleProgress"
                        :on-error="uploadError"
                        :on-success="uploadSuccess">
                        <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
                    </el-upload>
                </div>
            </el-col>

            <el-col :span="6">                           
                <el-button class="btns" icon="el-icon-folder-add" @click="addDir">新建文件夹</el-button> 
            </el-col>

            <el-col :span="12">
                <div>
                    <el-input class="input-with-select"
                        placeholder="搜索您的文件"
                        v-model="searchInput"
                        clearable
                        @clear="getUserFileList">
                        <el-button icon="el-icon-search" slot="append" @click="search"></el-button>
                    </el-input>   
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
var token = window.sessionStorage.getItem('token');

export default {
    data() {
        return {
            searchInput: '',
            uploadUrl: 'http://127.0.0.1:51002' + '/cloud-file-service/upload/fileUpload',
            path: window.sessionStorage.getItem('path'),
            myHeaders: {Authorization: window.sessionStorage.getItem('token')}
        }
    },
    methods: {
        beforeUpload(file) {
            this.path = window.sessionStorage.getItem('path');
        },
        handleProgress(file) {
            console.log(file);
        },
        uploadError(response, file, fileList) {
            console.log("上传文件失败，response:" +response);
            console.log("上传文件失败，file:" +file);
            console.log("上传文件失败，fileList:" +fileList);
        },
        async uploadSuccess() {
            this.getUserFileList();
            this.store.commit('increment');
        },
        addDir() {
            this.$store.commit('addDirDialogVisibleToTrue');
        },
        async search() {
            const {data: res} = await this.$http.get('cloud-file-service/file/search', {
                params: {
                    path: this.searchInput
                }
            });

        },
        async getUserFileList() {
            const path = window.sessionStorage.getItem("path");
            const {data: res} = await this.$http.get('cloud-file-service/file/gerUserFileList', {
                params: {
                    path: path
                }
            });
            console.log(res);
            if (res.code !== 200) return this.$message.error(res.message);
            const newFileList = res.data;
            var newFileListStr = JSON.stringify(newFileList);
            window.sessionStorage.setItem("fileList", newFileListStr);
            this.fileLlist = newFileList;
        }
    }
}
</script>

<style>
.btns {
    margin-left: 10px;
    margin-right: 10px;
}
.box-card {
    display: flex;
    justify-content: space-between;
    align-items: center; 
}
</style>