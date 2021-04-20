<template>
    <!-- 头部: 搜索栏、面包屑-->
    <!-- <Header/> -->

    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img class="logo_img" src="../assets/storm.png">
                <span>暴风网盘</span>
            </div>
            <el-dropdown>
                    <span class="el-dropdown-link">
                        我的
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-plus">个人资料</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-close" @click.native="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
        </el-header>
        <!--页面主题区域-->
        <el-container>
            <!--右侧内容主题-->
            <el-main>
                <div class="user-func">
                    <div class="file_func">
                       <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-exceed="handleExceed">
                            <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
                        </el-upload>
                        <el-button class="btns" icon="el-icon-folder-add" @click="addDir">新建文件夹</el-button> 
                    </div>
                    <div>
                        <el-input class="search-input"
                            placeholder="搜索您的文件"
                            prefix-icon="el-icon-search"
                            v-model="searchInput">
                        </el-input>
                        <el-button icon="el-icon-search" circle @click="search"></el-button>
                    </div>

                </div>
                <!--文件区-->
                <el-row>
                    <el-col
                        :offset="0"
                        :xs="24"
                        :sm="24"
                        :lg="24">
                        <List  ref="List"/>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import Header from './Header.vue'
import List from './List.vue'

export default {
    data() {
      return {
        searchInput: ''
      };
    },
    components: {
            List, Header
    },
    methods: {
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        addDir() {

        },
        search() {

        }
    }
}
</script>

<style lang='less' scoped>
    body {
        overflow: hidden;
    }
    .logo_img {
        height: 50px;
        width: 50px;
    }
    .btns {
        margin: 10px;
    }
    .user-func {
        display: flex;
        justify-content: space-between;
        align-items: center; 
    }
    .file_func {
        display: flex;
        align-items: center; 
    }
    .search-input {
        width: 300px;
    }
    .el-header {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color:#0066ff;
        font-size: 25px;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font: "PingFang SC";
        font-weight: bold;
        > div {
            display: flex;
            align-items: center;
            span {
                margin: 15px;
            }
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    .el-dropdown-link {
        background-color: #fff;
        color: #949294;
    }
    .home-container {
        height: 100%;
    }
</style>