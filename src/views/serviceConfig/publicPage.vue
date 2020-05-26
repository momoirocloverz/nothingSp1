<template>
    <div class="serviceQrcodePageCon">
              <div class="u-params-group">
        <div class="u-filter">
        <div style="color:#000">状态:</div>
        <div @click="handleFilterChange('')" class="u-select-button" :class="status===''?'u-selected':''">不限</div>
        <div @click="handleFilterChange(0)" class="u-select-button" :class="status===0?'u-selected':''">未发布</div>
        <div @click="handleFilterChange(1)" class="u-select-button" :class="status===1?'u-selected':''">已发布</div>
        </div>
         <el-input placeholder="请输入标题关键字查询" v-model="keyword" class="u-input-search" @keyup.enter.native="handleSearch">
            <el-button slot="append"  @click="handleSearch" icon="el-icon-search"></el-button>
        </el-input>
         <el-button class="u-button" type="primary" @click="handleAddInfo">发布公告</el-button>
      </div>
       <el-table :data="tableData"  v-loading="loading" stripe border  class="u-table" empty-text="暂无公告，点击‘发布公告‘ 按钮去创建新公告">
        <el-table-column
        align = "center"
        prop="title"
        label="标题"
        >
        </el-table-column>        
        <el-table-column
        align = "center"
        prop="status"         
        label="状态">
        <template v-slot="scope">
            <div class="u-not">{{statusMatch[scope.row.status]}}</div>
        </template>
        </el-table-column>
    <el-table-column
        align="center"
        prop="updatedAt"
        label="发布时间">
        </el-table-column>
         <el-table-column
         align = "center"
        prop="operation" label="操作">
        <template v-slot="scope">
            <div class="u-operation">
                <div class="u-operation-item" v-if="scope.row.status === 0" @click="editThis(scope.row)">编辑</div>
                <div class="u-operation-item" v-if="scope.row.status === 0" @click="publish(scope.row)">发布</div>
                 <div class="u-operation-item" v-else @click="hide(scope.row)">下架</div>
                 <div class="u-operation-item" v-if="scope.row.status === 0" @click="deleteThis(scope.row)">删除</div>
            </div>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :pageSize="pageSize"
    layout="total, prev, pager, next, jumper"
    class="u-pagination"
    :total="total">
    </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'serviceQrcodePageCon',
    props:{
        company:{
            type: String,
            default: '杭州萧山中心局',
        }
    },
    data() {
        return {
            keyword:'',
            pageSize:10,
            tableData:[],
            currentPage: 1,
            total:0,
            status:'',
            loading:false,
            statusMatch:{
                0:'未发布',
                1:'已发布',
            },
        }
    },
    mounted() {
        this.getArticleLists();        
    },
    methods: {
        publish(row){
            let params = {
                id:row.id,
                status:1,
            };
            this.Apis.infoManageApi.switchBoard(params).then(res=>{
                let { respCode } = res;
                if( respCode === 0 ){
                    this.$message({
                      message: '发布成功',
                      type: 'success'
                    });
                    this.handleSearch();
                }
            }).catch(err=>{
                console.log('err',err);
            })
        },
        hide(row){
            let params = {
                id:row.id,
                status:0,
            };
            this.Apis.infoManageApi.switchBoard(params).then(res=>{
                let { respCode } = res;
                if( respCode === 0 ){
                    this.$message({
                      message: '下架成功',
                      type: 'success'
                    });
                    this.handleSearch();
                }
            }).catch(err=>{
                console.log('err',err);
            })
        },
        editThis(row){
            this.$router.push({ 
                name: 'serviceEditor',
                query:{
                    area:this.company,
                    edit:'1',
                    id:row.id,
                    status:row.status
                }
            });
        },
        deleteThis(row){
            this.$confirm('删除公告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id:row.id,
                };
                this.Apis.infoManageApi.deleteBoard(params).then(res=>{
                    let { respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.handleSearch();
                    }                
                }).catch(err=>{
                    console.log('err',err);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },
        getArticleLists(){            
            let params = {
                region:this.company,
                status:this.status,    
                title:this.keyword,
                pageNum:this.currentPage,
                pageSize:this.pageSize,
            };
            this.Apis.infoManageApi.getBoardArticle(params).then(res=>{
                let { respCode,data } = res;
                if(respCode === 0){
                    this.total = data.total;
                    if(data && data.list){
                        this.tableData = data.list;
                    }else{
                        this.tableData = [];
                    }
                }else{
                    this.tableData = [];
                }
            }).catch(err=>{
                console.log('err',err);
            })
        },
       handleFilterChange(val){
           this.status = val;
           this.currentPage = 1;
           this.getArticleLists();
       },
        handleSearch(){
            this.currentPage = 1;
            this.getArticleLists();
        },
        handleAddInfo(){
            this.$router.push({ 
                name: 'serviceEditor',
                query:{
                    area:this.company,
                    edit:'0',
                }
            });
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getArticleLists();
        },
    }
}
</script>
<style lang="scss" scoped>
     .serviceQrcodePageCon {
         .u-table {
             width: 100%;
             margin-top: 20px;
         }
         .u-operation {
             width: 100%;
             display: flex;
             justify-content: space-around;
             .u-operation-item {
                 cursor: pointer;
                 color: #169BD5;
             }
         }
         .u-params-group {
             .u-input-search {
                 width: 400px;
             }
             display: flex;
             justify-content: space-around;
         }
         .u-pagination {
             margin-top: 20px;
         }
         .u-filter {
             width: 200px;
             display: flex;
             justify-content: space-between;
             position: relative;
             line-height: 40px;
             color: #CC6600;
         }
         .u-selected {
             color: #008000;
         }
         .u-select-button {
             cursor: pointer;
         }
    }
</style>