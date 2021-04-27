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
                    <span>文件名</span>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="download">下载</el-button>
                        <el-button type="primary" @click="save">保存到网盘</el-button>
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
                fileName: this.$store.shareFileName,
                path: this.$store.sharePath,
                link: this.$route.params.link
            });
            if (res.code !== 200) {
                this.$message.error(res.message);
                this.errorDialogVisible = true;
            }
            this.$message.success(res.message);
        },
        async checkSecret() {
            //验证提取码是否正确
            const {data: res} = await this.$http.post('cloud-file-service/share/checkSecret',{
                fileName: this.$store.shareFileName,
                path: this.$store.sharePath,
                secret: this.shareForm.linkSecret
            });
            if (res.code !== 200) this.$message.error(res.message);
            this.$message.success(res.message);
            this.downloadShareFileDialogVisible = true;
        },
        toHome() {
            errorDialogVisible = false;
            this.$router.push('/home');
        },
        download() {
            var downloadFileName = this.$store.shareFileName;
            const test = {
                //get访问下载接口
                getDownLoad: (params) => this.$http.get("cloud-file-service/download/fileDownload", {params: params, responseType: "blob"})
            };
            const params = {
                fileName: downloadFileName,
                path: this.$store.sharePath
            };
            test.getDownLoad(params).then((res) => {
                saveAs(new Blob([res.data], {type:res.header.type}), downloadFileName);
            });
        },
        save() {
            //发起添加到我的网盘请求
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
</style>