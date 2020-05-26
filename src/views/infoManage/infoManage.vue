<template>
    <div class="u-info-manage">
        <div class="subCon">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="u-breadcrumb">
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="u-params-group">
        <div class="u-filter">
        <div style="color:#000">状态:</div>
        <div @click="handleFilterChange('')" class="u-select-button" :class="status===''?'u-selected':''">不限</div>
        <div @click="handleFilterChange(0)" class="u-select-button" :class="status===0?'u-selected':''">未上架</div>
        <div @click="handleFilterChange(1)" class="u-select-button" :class="status===1?'u-selected':''">已上架</div>
        </div>
         <el-input placeholder="请输入标题" v-model="keyword" class="u-input-search" @keyup.enter.native="handleSearch">
            <el-button slot="append"  @click="handleSearch" icon="el-icon-search"></el-button>
        </el-input>
         <el-button class="u-button" type="primary" @click="handleAddInfo">添加资讯</el-button>
      </div>
       <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        class="u-table"
        >
        <el-table-column
        align="center"
        prop="createdAt"
        label="添加时间"
        width="180">
        </el-table-column>
        <el-table-column
        align = "center"
        prop="title"
        label="标题"
        >
        </el-table-column>
        <el-table-column
        align = "center"
        prop="source"
        width="250"
        label="来源">
        </el-table-column>
        <el-table-column
        align = "center"
        prop="status"
         width="150"
        label="状态">
        <template slot-scope="{row}">
            <div class="u-not" v-if="row['status']===0">未上架</div>
             <div class="u-already" v-else>已上架</div>
        </template>
        </el-table-column>
         <el-table-column
         align = "center"
        prop="operation"
        width="300"
        label="操作">
        <template slot-scope="{row}">
            <div class="u-operation">
                <div class="u-operation-item" @click="handleEditInfo({id:row.id})">编辑</div>
                <div class="u-operation-item" v-if="row['status']===0" @click="handleSetSoldOutAndPutaway({id:row.id})">上架</div>
                 <div class="u-operation-item" v-else @click="handleSetSoldOutAndPutaway({id:row.id})">下架</div>
                 <div class="u-operation-item" @click="hanldeDeleteInfo({id:row.id,title:row.title})">删除</div>
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
    </div>
</template>
<script>
export default {
    name: 'infoManage',
    data() {
        return {
            keyword:'',
            loading: false,
            pageSize:20,
            tableData:[{
                createdAt:'1999',
                title:'111',
                source:'111',
                status: 0,
                id:1
            }],
            currentPage: 1,
            total:0,
            status:''
        }
    },
    mounted() {
        this.handleGetList({
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            keyword:this.keyword,
            status:this.status
        });
    },
    methods: {
      handleCurrentChange(currentPage) {
          this.currentPage = currentPage;
          this.handleGetList({
              currentPage:this.currentPage,
              pageSize:this.pageSize,
              keyword:this.keyword,
              status:this.status
          });
      },
      handleSearch(){
        this.handleGetList({
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            keyword:this.keyword,
            status:this.status
        });
      },
      handleGetList({currentPage=1,pageSize=20,keyword='',status=''}){
          this.loading = true;
          this.Apis.infoManageApi.getList({currentPage,pageSize,keyword,status}).then(res=>{
            this.loading = false;
            this.tableData = res.data.list;
            this.total = res.data.total;
        })
      },
      handleAddInfo(){
          this.$router.push({ name: "infoEditor" ,query:{type:"0"}});
      },
      handleEditInfo({id}){
          this.$router.push({ name: "infoEditor" ,query:{type:"1",id}});
      },
      handleFilterChange(status){
          this.status = status;
          this.handleGetList({
              currentPage:this.currentPage,
              pageSize:this.pageSize,
              keyword:this.keyword,
              status:this.status
          }).then(res=>{
              
          });
      },
      handleSetSoldOutAndPutaway({id}){
          this.Apis.infoManageApi.setSoldOutAndPutaway({id}).then(res=>{
            this.handleGetList({currentPage:this.currentPage,pageSize:this.pageSize,keyword:this.keyword,status:this.status});
             });
      },
      hanldeDeleteInfo({id,title}){
          this.$confirm('确认删除？', title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
        this.Apis.infoManageApi.setDeleteInfo({id}).then(res=>{
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
                this.handleGetList({currentPage:this.currentPage,pageSize:this.pageSize,keyword:this.keyword,status:this.status});
            })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
          
      }
    }
}
</script>
<style lang="scss" scoped>
 .u-info-manage {
     box-sizing: border-box;
     padding: 20px;  
     .subCon {
         background-color: #fff;
         padding: 20px;
         box-sizing: border-box;
     }
      .u-breadcrumb {
          margin: 0 20px;
          font-size: 18px;
          font-weight: 700;
          color: #000;
        }
     .u-table {
         width: 100%;
         margin-top: 20px;
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
     .u-operation {
         width: 100%;
         display: flex;
         justify-content: space-around;
         .u-operation-item {
             cursor: pointer;
             color: #169BD5;
         }
     }
     .u-not {
         color: #CC6600;
     }
     .u-already {
         color: #008000
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