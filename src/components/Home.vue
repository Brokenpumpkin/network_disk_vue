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
                <!-- <UserFunc/> -->
                <!--文件区-->
                <el-row>
                    <el-col :offset="0" :xs="24" :sm="24" :lg="24">
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
import UserFunc from './UserFunc'

export default {
    data() {
      return {
        
      };
    },
    components: {
            List, Header, UserFunc
    },
    methods: {
        
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
</style>