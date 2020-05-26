<template>
    <div class="serviceConfigCon">
        <div class="subCon">
            <div class="title">区域客服设置和公告栏设置</div>
            <div class="selectCon">
                <span>选择生产区域</span>
                <el-select class="selectSelf" @change="companyChange" v-model="company" placeholder="请选择">
                <el-option
                  v-for="(item,index) in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="tabCon">
                <div class="tabBtnCon">
                     <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
                        <el-tab-pane label="客服设置" name="first"></el-tab-pane>
                        <el-tab-pane label="公告设置" name="second"></el-tab-pane>
                      </el-tabs>
                </div>
                <div class="contentCon">
                    <qrcodePage v-if="activeName == 'first'" :company="company"></qrcodePage>
                    <publicPage v-if="activeName == 'second'" :company="company"></publicPage>
                </div>
            </div>
        </div>
    </div>
</template>
<script>        
    import publicPage from '@/views/serviceConfig/publicPage.vue';
    import qrcodePage from '@/views/serviceConfig/qrcodePage.vue';
export default {
    name: 'serviceConfig',
    components:{
        qrcodePage,
        publicPage
    },
    data() {
        return {
            options:[
                {
                  value: '杭州萧山中心局',
                  label: '杭州萧山中心局'
                },
                {
                  value: '杭州坎山区',
                  label: '杭州坎山区'
                },
                {
                  value: '宁波鄞州区',
                  label: '宁波鄞州区'
                },
                {
                  value: '绍兴上虞区',
                  label: '绍兴上虞区'
                },                
            ],
            company:'杭州萧山中心局',
            activeName:'first',
        }
    },
    mounted() {
        this.analyseQuery();
    },
    methods: {
        analyseQuery(){
            this.$nextTick(()=>{
                if( this.$route.query.selectVal ){
                    this.company = this.$route.query.selectVal;
                    this.activeName = 'second';
                }else{
                    this.company = '杭州萧山中心局';
                    this.activeName = 'first';
                }
            });
        },
        companyChange(){
            let tempStore = this.activeName;
            this.activeName = '';            
            this.$nextTick(()=>{
                this.activeName = tempStore;
                this.$forceUpdate();
            });
        },
        handleClick(activeName){
            
        },
    }
}
</script>
<style lang="scss" scoped>
 .serviceConfigCon {
     padding: 20px;
     color: #666;
 }
      .subCon {
         background-color: #fff;
         padding: 20px;
         box-sizing: border-box;
     }
    .title {
        text-align: center;
        margin-bottom: 20px;
    }
    .selectCon {
        text-align: center;
        margin-bottom: 20px;
    }
    .selectSelf {
        margin-left: 20px;
    }
</style>