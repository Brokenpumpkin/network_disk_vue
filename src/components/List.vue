<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="index" @click.native="updateBreadcrumb(index)">
            {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb> 
      <el-table
            :key="$store.state.count"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255,.5)"
            :data="fileList"
            max-height="450"
            >               
            <el-table-column
                prop="isDir" 
                min-width="8%">
                <template slot-scope="scope">
                    <i v-if="scope.row.isDir === 1" class="el-icon-folder"></i>
                    <i v-else class="el-icon-document"></i>
                </template>
            </el-table-column>

            <el-table-column
                icon="el-icon-document"
                label="文件名"
                prop="userFileName"
                label-class-name="table-header-left"
                min-width="100%"
                sortable="custom">
                <template slot-scope="scope">
                    <div v-if="scope.row.isDir === 1" @click="intoDir(scope.row.userFileName)">{{scope.row.userFileName}}</div>
                    <div v-else>{{scope.row.userFileName}}</div>
                </template>
            </el-table-column>
                                
            <el-table-column>
                <template slot-scope="scope">
                    <i class="el-icon-share" @click="share"></i>
                    <i class="el-icon-download" @click="download"></i>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>移动到</el-dropdown-item>
                            <el-dropdown-item @click.native="ranameBtn">重命名</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>                   
            </el-table-column>

            <el-table-column
                prop="fileSize"
                label="大小"
                sortable="custom"
                min-width="20%">
                <template slot-scope="scope">
                    <div v-if="scope.row.isDir === 1"><span>--</span></div>
                    <div v-else><span>{{scope.row.fileSize}}</span></div>
                </template>
            </el-table-column>

            <el-table-column
                    prop="updateTime"
                    label="修改时间"
                    sortable="custom"
                    min-width="35%">
                <template slot="header">
                    <i class="el-icon-date"></i>
                    <span>修改时间</span>
                </template>
            </el-table-column>
      </el-table>

      <el-dialog
        title="新建文件夹"
        :visible.sync="$store.state.addDirDialogVisible"
        width="30%"
        @close="addDirDialogClosed">
        <!--内容主体区-->
        <el-form ref="addDirRef" :model="addDirForm" :rules="addDirRules" label-width="80px">
            <el-form-item label="文件夹名" prop="dirName">
                <el-input v-model="addDirForm.dirName"></el-input>
            </el-form-item>
        </el-form>
        <!--按钮区-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="$store.commit('addDirDialogVisibleToFalse')">取 消</el-button>
            <el-button type="primary" @click="addDir">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
            title="重命名"
            :visible.sync="$store.state.renameDialogVisible"
            width="30%"
            @close="renameDialogClosed">
            <el-form ref="renameRef" :model="renameForm" :rules="renameRules" label-width="80px">
                <el-form-item label="新的名称" prop="newName">
                    <el-input v-model="renameForm.newName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$store.commit('renameDialogVisibleToFalse')">取 消</el-button>
                <el-button type="primary" @click="rename">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    created() {
        this.getBreadcrumb();
        this.getUserFileList();
        this.$forceUpdate();
    },
    data() {
        return {
            // 是否首次初始化完成
            initLoading: true,
            // 是否初始化加载完成
            loading: false,
            //添加文件夹表单
            addDirForm: {
                dirName: ''
            },
            addDirRules: {
                dirName: [
                    {required:true, message: '请输入文件夹的名称', trigger: 'blur'},
                    {min: 1, max: 25, message: '文件夹的名称长度在1到25个字符之间', trigger: 'blur'}
                ]
            },
            renameForm: {
                newName: ''
            },
            renameRules: {
                newName: [
                    {required:true, message: '请输入新的名称', trigger: 'blur'},
                    {min: 1, max: 25, message: '新的名称长度在1到25个字符之间', trigger: 'blur'}
                ]
            },
            fileList: [],
            // updateFileList: [],
            levelList: []
        }
    },
    computed: {
        updateFileList() {
            const newfileList = window.sessionStorage.getItem("fileList");
            var newFileListStr = JSON.stringify(newfileList);
            return newFileListStr;
        }
    },
    methods: {
        // ...mapMutations(['updateFileList']),
        async getUserFileList() {
            const path = window.sessionStorage.getItem("path");
            console.log(path);
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
            this.fileList = newFileList;
            this.initLoading = false;
        },
        download() {
            console.log(this.updateFileLlist);
        },
        share() {

        },
        async intoDir(fileName) {
            const path = window.sessionStorage.getItem("path");
            const newPath = path + "/" + fileName;
            window.sessionStorage.setItem("path", newPath);
            console.log(newPath);
            const {data: res} = await this.$http.get('cloud-file-service/file/gerUserFileList', {
                params: {
                    path: newPath
                }
            });
            console.log(res);
            if (res.code !== 200) return this.$message.error(res.message);
            const newFileList = res.data;
            var newFileListStr = JSON.stringify(newFileList);
            window.sessionStorage.setItem("fileList", newFileListStr);
            this.fileList = newFileList;
            this.levelList = newPath.substr(1).split("/");
        },
        getBreadcrumb() {
            const path = window.sessionStorage.getItem("path");
            this.levelList = path.substr(1).split("/");
        },
        async updateBreadcrumb(index) {
            var path = "";
            for (let i = 0; i < index + 1; i++) {
                const element = this.levelList[i];
                path = path + "/" + element;
            }
            window.sessionStorage.setItem("path", path);
            this.levelList = path.substr(1).split("/");
            console.log(path);
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
            this.fileList = newFileList;
        },
        //监听新建文件夹对话框的关闭事件
        addDirDialogClosed() {
            this.$refs.addDirRef.resetFields();
        },
        addDir() {
            const path = window.sessionStorage.getItem('path');
            this.$refs.addDirRef.validate(async valid => {
                if (!valid) return;
                const {data: res} =  await this.$http.post('cloud-file-service/file/dirCreate', {
                    dirName: this.addDirForm.dirName,
                    path: path               
                });
                if (res.code !== 200) this.$message.error(res.message);
                this.$message.success(res.message);
                this.$store.commit('addDirDialogVisibleToFalse');
                this.getUserFileList();
            })          
        },
        renameDialogClosed() {
            this.$refs.renameRef.resetFields();
        },
        rename() {

            this.$store.commit('addDirDialogVisibleToFalse');
        },
        ranameBtn() {
            this.$store.commit('renameDialogVisibleToTrue');
        }
    }
}
</script>

<style lang='less' scoped>

.el-dropdown-link {
    cursor: pointer;
    padding: 10px;
}
.el-icon-share {
    cursor: pointer;
    padding: 10px;
}
.el-icon-download {
    cursor: pointer;
    padding: 10px;
}
.el-breadcrumb {
    padding: 15px;
    background-color: #fff;
    font-weight: bold;
    margin-top: 15px;
    height: 5%;
}
.el-breadcrumb-item {
    font-weight: bold;
    cursor: pointer;
}
</style>