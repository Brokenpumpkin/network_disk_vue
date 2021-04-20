<template>
  <div>
      <!-- <el-form :inline="true" class="disk-header" size="mini">
          <div>
             <el-form-item>
                <img class="logo_img" src="../assets/storm.png">
            </el-form-item> 

            <el-form-item>
                <el-breadcrumb>
                    <el-breadcrumb-item>网盘</el-breadcrumb-item>
                </el-breadcrumb>
            </el-form-item>
          </div>

          <el-form-item>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        我的
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-plus">个人资料</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-close" @click.native="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
          </el-form-item>
      </el-form> -->
  </div>
</template>

<script>
export default {
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>

<style lang='less' scoped>
.disk-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 48px;
    line-height: 48px !important;
    background: #fafafa;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    padding-left: 30px;
}
.disk-header .el-breadcrumb {
    line-height: 48px;
    font-size: 13px;
}
.disk-header .el-input {
    line-height: 48px;
}

</style>