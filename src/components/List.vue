<template>
  <div>
      <el-card class="box-card">
            <el-row :gutter="25">
                <el-col :span="5">                  
                    <!-- <el-upload
                        class="upload-demo"
                        action="http://127.0.0.1:51002/cloud-file-service/upload/fileUpload"
                        :headers="myHeaders"
                        :data="{path: path}"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-progress="handleProgress"
                        :on-error="uploadError"
                        :on-success="uploadSuccess">
                        <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
                    </el-upload> -->
                    <el-button type="primary" icon="el-icon-upload" class="mr10" @click="uploadFiles()">文件上传</el-button>                  
                </el-col>

                <el-col :span="6">                           
                    <el-button class="btns" icon="el-icon-folder-add" @click="addDirBtn">新建文件夹</el-button> 
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
                    <div class="user-file-name" v-if="scope.row.isDir === 1" @click="intoDir(scope.row.userFileName)">{{scope.row.userFileName}}</div>
                    <div class="user-file-name" v-else>{{scope.row.userFileName}}</div>
                </template>
            </el-table-column>
                                
            <el-table-column>
                <template slot-scope="scope">
                    <i class="el-icon-share" v-if="scope.row.isDir === 0" @click="shareBtn(scope.row.userFileName)"></i>
                    <i class="el-icon-download" v-if="scope.row.isDir === 0" @click="download(scope.row.userFileName)"></i>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="fileMoveBtn(scope.row.userFileName)">移动到</el-dropdown-item>
                            <el-dropdown-item @click.native="ranameBtn(scope.row.userFileName)">重命名</el-dropdown-item>
                            <el-dropdown-item @click.native="fileDelete(scope.row.userFileName)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>                   
            </el-table-column>

            <el-table-column
                prop="fileSize"
                label="大小"
                sortable
                min-width="20%">
                <template slot-scope="scope">
                    <div class="file-size" v-if="scope.row.isDir === 1"><span>--</span></div>
                    <div class="file-size" v-else><span>{{scope.row.fileSize}}</span></div>
                </template>
            </el-table-column>

            <el-table-column
                    prop="updateTime"
                    label="修改时间"
                    sortable
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

      <el-dialog
            title="移动到"
            :visible.sync="$store.state.fileMoveDialogVisible"
            width="40%">
            <el-tree
                lazy
                highlight-current
                icon-class="el-icon-plus"
                ref="tree"
                node-key="id"
                empty-text="暂无数据"
                :load="loadNode"
                :props="dirProps"
                :show-checkbox="true"
                :check-strictly="true"
                @node-click="handleNodeClick"
                @check-change="checkChange"
                :render-content="renderContent">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$store.commit('fileMoveDialogVisibleToFalse')">取 消</el-button>
                <el-button type="primary" @click="fileMove">确 定</el-button>
            </span>
      </el-dialog>

      <el-dialog
            title="分享文件（夹）"
            :visible.sync="shareDialogVisible"
            width="30%">
            <span>有效期：</span>
            <el-select v-model="value" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="creatShareLink">创建链接</el-button>
            </span>
      </el-dialog>

      <el-dialog
            title="分享文件（夹）"
            :visible.sync="shareLinkDialogVisible"
            width="50%">
            <p>分享链接：</p>
            <a @click="goToShare">{{this.shareFileUrl + "?link=" + this.shareLink}}</a>
            <el-divider></el-divider>
            <p>提取码：</p>
            <a>{{this.shareSercet}}</a>

            <span slot="footer" class="dialog-footer">
                <el-button @click="shareLinkDialogVisible=false">取 消</el-button>
                <el-button 
                class="btn"
                :data-clipboard-text="'分享链接：' + this.shareFileUrl + this.shareLink + ' 提取码：'  + this.shareSercet">
                    一键复制链接及提取码
                </el-button>
            </span>
      </el-dialog>

      <!--上传附件弹出框 -->
        <el-dialog title="文件上传" center :visible.sync="uploadVisible" width="60%" @close="handlerClose">
            <UploadBigFile class="uploadSlot"></UploadBigFile>
        </el-dialog>

  </div>
</template>

<script>
import UploadBigFile from './Upload';
import ClipboardJS from 'clipboard';
var clipboard = new ClipboardJS('.btn');

export default {
    created() {
        this.getBreadcrumb();
        this.getUserFileList();
    },
    components:{
        UploadBigFile
    },
    data() {
        return {
            shareFileUrl: 'http://127.0.0.1:8080/#/shareFileSecret/',
            //分享链接
            shareLink: '',
            //提取码
            shareSercet: '',
            oldName: '',
            moveFileName: '',
            shareFileName: '',
            uploadVisible: false,
            //点击分享显示的对话框
            shareDialogVisible: false,
            //在分享对话框中点击创建链接后显示的对话框
            shareLinkDialogVisible: false,
            // 是否首次初始化完成
            initLoading: true,
            // 是否初始化加载完成
            loading: false,
            //搜索框的输入
            searchInput: '',
            //上传的后端地址
            uploadUrl: 'http://127.0.0.1:51002' + '/cloud-file-service/upload/fileUpload',
            //上传的文件夹路径
            path: '',
            uploadParams: {
                path: ''
            },
            //token
            myHeaders: {Authorization: window.sessionStorage.getItem('token')},
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
            options: [{
                value: '1',
                label: '1天'
            }, {
                value: '7',
                label: '7天'
            }, {
                value: '永久有效',
                label: '永久有效'
            }],
            //分享链接过期具体值
            value: '',
            editCheckId: '',
            dirProps: {
                children: [],
                label: 'name',
                isLeaf: "leaf"
            },
            fileList: [],
            levelList: []
        }
    },
    computed: {
        
    },
    methods: {
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
            this.fileList = newFileList;
            this.initLoading = false;
        },
        uploadFiles() {
            this.uploadVisible = true;
        },
        // 关闭上传文件弹出框时触发
        handlerClose(){
            this.getUserFileList();
        },
        async download(downloadFileName) {
            const nowPath = window.sessionStorage.getItem("path");
            
            this.loadingOverLay = this.$loading({
                lock: true,
                text: '文件生成中',
                spinner: 'el-icon-loading',
                background: 'rgba(0,0,0,0.7)'
                });
            // var elemIF = document.createElement('iframe');
            // elemIF.src = "http://127.0.0.1:51002"+'/cloud-file-service/download/download?path=' + nowPath + '&filename=' + downloadFileName;
            // elemIF.style.display ='none';
            // document.body.appendChild(elemIF);	 

            const test = {
                getDownLoad: (params) => this.$http.get("cloud-file-service/download/download"
                , {params: params, responseType: "blob"})
            };
            const params = {
                fileName: downloadFileName,
                path: nowPath
            };
            test.getDownLoad(params).then((res) => {
                saveAs(new Blob([res.data], {type:res.data.type}), downloadFileName);
            });  
            this.loadingOverLay.close();
        },
        async intoDir(fileName) {
            const path = window.sessionStorage.getItem("path");
            const newPath = path + "/" + fileName;
            window.sessionStorage.setItem("path", newPath);
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
            this.path = newPath;
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
            console.log(this.addDirForm.dirName);
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
            const path = window.sessionStorage.getItem('path');
            this.$refs.renameRef.validate(async valid => {
                if (!valid) return;
                const {data: res} =  await this.$http.post('cloud-file-service/file/fileRename', {
                    oldName: this.oldName,
                    newName: this.renameForm.newName,
                    path: path               
                });
                if (res.code !== 200) this.$message.error(res.message);
                this.$message.success(res.message);
                this.$store.commit('renameDialogVisibleToFalse');
                this.getUserFileList();
            })
        },
        async fileDelete(delFileName) {
            const nowPath = window.sessionStorage.getItem("path");
            const {data: res} = await this.$http.get('cloud-file-service/file/fileDelete', {
                params: {
                    fileName: delFileName,
                    path: nowPath
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            this.getUserFileList();
        },
        async beforeUpload(file) {
            this.path = window.sessionStorage.getItem('path');
            console.log(this.path);
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
            this.$store.commit('increment');
        },
        addDirBtn() {
            this.$store.commit('addDirDialogVisibleToTrue');
        },
        ranameBtn(oldFileName) {
            this.oldName = oldFileName;
            this.$store.commit('renameDialogVisibleToTrue');
        },
        async fileMove() {
            var path = window.sessionStorage.getItem('path');
            var node = this.$refs.tree.getCheckedNodes()[0];
            const {data: res} = await this.$http.post('cloud-file-service/file/fileMove',{
                fileName: this.moveFileName,
                oldPath: path,
                newPath: node.path + "/" + node.name
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            this.$store.commit('fileMoveDialogVisibleToFalse');
            this.getUserFileList();
        },
        async fileMoveBtn(fileName) {
            this.moveFileName = fileName;
            this.$store.commit('fileMoveDialogVisibleToTrue');
        },
        loadNode(node, resolve) {
            // 一级节点处理 
            if (node.level == 0) { 
                this.requestTree(resolve);
            }
            // 其余节点处理
            if (node.level >= 1) { 
                this.getIndex(node, resolve);
            }
        },
        async requestTree(resolve) {
            const {data: res} = await this.$http.get('cloud-file-service/file/getUserDirList',{
                params: {
                    path: window.sessionStorage.getItem('username')
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            var datas = res.data;
            datas.forEach(value => {
                value.leaf = false
            })
            resolve(datas);
        },
        async getIndex(node, resolve) {
            console.log(node.data.name);
            console.log(node.data.path);
            const {data: res} = await this.$http.get('cloud-file-service/file/getUserDirList',{
                params: {
                    path: node.data.path + "/" + node.data.name
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            var datas = res.data;
            datas.forEach(value => {
                value.leaf = false
            })
            resolve(datas);   
        },
        renderContent: function (h, {
            node,
            data,
            store
        }) {
            return ( <span> <i class = 'el-icon-folder-opened' style = "color: #FFB427;"></i>
            <span title={node.data.name} class = 'style-demo'>{node.data.name}</span > </span>);
        },
        handleNodeClick(item,node,self) {
            this.editCheckId=item.id;
            this.$refs.tree.setCheckedKeys([item.id]);
        },
        // tree单选
        checkChange (item,node,self) {
            if (node == true) {
               this.editCheckId=item.id;
               this.$refs.tree.setCheckedKeys([item.id])
            }else {
               if (this.editCheckId == item.id) {
                   this.$refs.tree.setCheckedKeys([item.id])
               }
            }
        },
        async creatShareLink() {
            const nowPath = window.sessionStorage.getItem("path");
            // 向后端发起获取分享链接和提取码的请求 
            const {data: res} = await this.$http.get('cloud-file-service/share/getShareLink', {
                params: {
                    expireDay: this.value,
                    fileName: this.shareFileName,
                    path: window.sessionStorage.getItem('path')
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            var shareLinkVo = res.data;
            this.shareLink = shareLinkVo.secretLink;
            this.shareSercet = shareLinkVo.secret;
            this.shareLinkDialogVisible = true;
            this.shareDialogVisible = false;
        },
        shareBtn(shareFileName) {
            this.shareFileName = shareFileName;
            this.$store.commit('setShareFileName', shareFileName);
            this.$store.commit('setSharePath', window.sessionStorage.getItem('path'));
            this.shareDialogVisible = true;
        },
        copyToBoard() {
            
        },
        goToShare() {
            this.$router.push({path:'/shareFileSecret', query:{
                link:this.shareLink}
            } );
        },
        async search() {
            const {data: res} = await this.$http.get('cloud-file-service/file/search', {
                params: {
                    keyword: this.searchInput
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            const newFileList = res.data;
            var newFileListStr = JSON.stringify(newFileList);
            window.sessionStorage.setItem("fileList", newFileListStr);
            this.fileList = newFileList;
        }
    }
}
</script>

<style lang='less' scoped>
.btns {
    margin-left: 10px;
    margin-right: 10px;
}
.box-card {
    display: flex;
    justify-content: space-between;
    align-items: center; 
}
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
.user-file-name {
    cursor: default;
}
.file-size {
    cursor: default;
}
.uploadSlot {
    margin: -10px 10px 10px 30px;
}
</style>