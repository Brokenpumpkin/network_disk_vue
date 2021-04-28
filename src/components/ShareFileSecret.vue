<template>
  <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <Header/>
        </el-header>
        <!--页面主题区域-->
        <el-container>
            <!--右侧内容主题-->
            <el-main>
                <div class="share_box">
                    <h3 class="title">请输入提取码</h3>
                    <el-form ref="shareFormRef" :model="shareForm" label-width="80px" class="share_from">
                        <!--提取码-->
                        <el-form-item prop="linkSecret">
                            <el-input v-model="shareForm.linkSecret" prefix-icon="el-icon-lock"></el-input>
                        </el-form-item>
                        <el-form-item class="btns">
                            <el-button type="primary" @click="checkSecret">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-dialog
                    title="下载分享文件"
                    :visible.sync="downloadShareFileDialogVisible"
                    width="30%">

                    <i class="el-icon-document"></i>
                    <h2>{{this.shareFileName}}</h2>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="download">下载</el-button>
                        <el-button type="primary" @click="saveBtn">保存到网盘</el-button>
                        <el-button @click="downloadShareFileDialogVisible=false">取 消</el-button>
                    </span>
                </el-dialog>
                
                <el-dialog
                    title="提示"
                    :visible.sync="errorDialogVisible"
                    width="60%"
                    center>
                    <span>该链接是无效链接或该链接无效</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="toHome">返回主页</el-button>
                    </span>
                </el-dialog>

                <el-dialog
                    title="保存到"
                    :visible.sync="fileSaveDialogVisible"
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
                        <el-button @click="fileSaveDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="fileSaveTo">确 定</el-button>
                    </span>
            </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from './Header.vue'
export default {
    created() {
        this.checkShareLink()
    },
    data() {
        return {
            downloadShareFileDialogVisible: false,
            errorDialogVisible: false,
            fileSaveDialogVisible: false,
            shareFileName: '',
            dirProps: {
                children: [],
                label: 'name',
                isLeaf: "leaf"
            },
            shareForm: {
                linkSecret: ''             
            }
        }
    },
    components: {
        Header
    },
    methods: {
        async checkShareLink() {
            //验证分享链接是否过期或合法
            const {data: res} = await this.$http.post('cloud-file-service/share/checkShareLink',{
                link: this.$route.query.link
            });
            if (res.code !== 200) {
                this.$message.error(res.message);
                this.errorDialogVisible = true;
            }
            this.shareFileName = res.data.fileName;
        },
        async checkSecret() {
            //验证提取码是否正确
            const {data: res} = await this.$http.post('cloud-file-service/share/checkSecret',{
                link: this.$route.query.link,
                secret: this.shareForm.linkSecret
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            this.downloadShareFileDialogVisible = true;
        },
        toHome() {
            this.errorDialogVisible = false;
            this.$router.push('/home');
        },
        download() {
            const test = {
                //get访问下载接口
                getDownLoad: (params) => this.$http.get("cloud-file-service/share/shareDownload", {params: params, responseType: "blob"})
            };
            const params = {
                link: this.$route.query.link
            };
            test.getDownLoad(params).then((res) => {
                console.log(res);
                console.log(res.headers);
                console.log(res.headers.filename);
                var filename = res.headers.filename;
                saveAs(new Blob([res.data], {type:res.data.type}), res.headers.filename);
            });
        },
        saveBtn() {
            this.fileSaveDialogVisible = true;           
        },
        async fileSaveTo() {
            var node = this.$refs.tree.getCheckedNodes()[0];
            //发起添加到我的网盘请求
            const {data: res} = await this.$http.get('cloud-file-service/share/saveToDisk', {
                params: {
                    link: this.$route.params.link,
                    path: node.path + "/" + node.name
                }
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            this.fileSaveDialogVisible = false; 
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
        }
    }
}
</script>

<style lang='less' scoped>
body {
    overflow: hidden;
}

.el-main {
    background-color: #eaedf1;
}

.home-container {
    height: 100%;
}
.share_box {
    width: 450px;
    height: 200px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.share_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    transform: translate(-10%);
}
.btns {
    display: flex;
    justify-content: center;
}
.title {
    display: flex;
    justify-content: center;
}
.el-icon-document {
    display: flex;
    justify-content: center;
    font-size: 40px;
}
</style>