<template>
  <div id="List" v-loading="initLoading">
      <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255,.5)"
                :data="fileLlist"
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
                    prop="fileName"
                    label-class-name="table-header-left"
                    min-width="100%"
                    sortable="custom">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isDir === 1" @click="intoDir">{{scope.row.fileName}}</div>
                        <div v-else>{{scope.row.fileName}}</div>
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
                            <el-dropdown-item>重命名</el-dropdown-item>
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
                <template slot="header">
                    <i class="el-icon-coin"></i>
                    <span>大小</span>
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
  </div>
</template>

<script>
export default {
    created() {
        this.getUserFileList()
    },
    data() {
        return {
            // 是否首次初始化完成
            initLoading: true,
            // 是否初始化加载完成
            loading: false,
            //文件列表数据
            fileLlist: []
        }
    },
    methods: {
        async getUserFileList() {
            const username = window.sessionStorage.getItem("username");
            const {data: res} = await this.$http.get('cloud-file-service/file/gerUserFileList', {
                params: {
                    path: "/" + username
                }
            });
            console.log(res);
            if (res.code !== 200) return this.$message.error(res.message);
            this.fileLlist = res.data;
            this.initLoading = false;
        },
        download() {

        },
        share() {

        },
        intoDir() {
            console.log("111111111111111")
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

</style>