<template>
    <div class="u-official">
        <div class="subCon"> 
      <el-breadcrumb separator-class="el-icon-arrow-right" class="u-breadcrumb">
        <el-breadcrumb-item>官网预约</el-breadcrumb-item>
      </el-breadcrumb>
       <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        class="u-table"
        >
        <el-table-column
        align="center"
        prop="name"
        label="姓名"
        >
        </el-table-column>
        <el-table-column
        align = "center"
        prop="mobile"
        label="电话"
        >
        </el-table-column>
        <el-table-column
        align = "center"
        prop="demand"
        label="需求">
        <template slot-scope="{row}">
             <div>{{needsMap[row['demand']]}}</div>
        </template>
        </el-table-column>
         <el-table-column
           align = "center"
           prop="createdAt"
           label="预约时间"
         >
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
            loading: false,
            pageSize:20,
            tableData:[],
            currentPage: 1,
            total:0,
            needsMap: {
                [1]:'灵活用工',
                [2]:'财务统筹',
                [3]:'商保服务',
                [4]:'社保合规用工',
                [5]:'零工管理优化',
                [6]:'人博会'
            }
        }
    },
    mounted() {
        this.handleOfficalList({currentPage:this.currentPage,pageSize:this.pageSize});
    },
    methods: {
      handleCurrentChange(currentPage) {
          this.currentPage = currentPage;
          this.handleOfficalList({currentPage:this.currentPage,pageSize:this.pageSize});
      },
      handleOfficalList({currentPage=1,pageSize=20}){
          this.loading = true;
          this.Apis.officialApi.getList({currentPage,pageSize}).then(res=>{
            this.loading = false;
            this.tableData = res.data.list
            this.total = res.data.total
        })
      },
    }
}
</script>
<style lang="scss" scoped>
 .u-official {
     padding: 20px;
 }
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
</style>