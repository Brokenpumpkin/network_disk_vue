<template>
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
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>

<style lang='less' scoped>
.logo_img {
    height: 50px;
    width: 50px;
}
.el-dropdown-link {
    background-color: #fff;
    color: #949294;
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
</style>