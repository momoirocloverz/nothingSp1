<template>
  <div class="homeCon">
      <div class="topPart">
          <cusHeader></cusHeader>
        </div>
      <div class="bottomPart">
          <div class="leftCon" :style="leftStyle">
              <Sidebar></Sidebar>
            </div>
          <div class="rightCon" :style="rightStyle">
              <router-view></router-view>
            </div>
        </div>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import cusHeader from '@/components/Header.vue'
    import Sidebar from '@/components/Sidebar.vue'
export default {
    name: 'homeCon',
    components:{
        cusHeader,
        Sidebar
    },
    computed: {
        ...mapGetters({
            collapse:'getCollapse',
        }),
    },
    watch:{
        collapse:function(nval,val){
            this.setStyle(nval);
        },
    },
    data() {
        return {
            leftStyle:{
                width: '250px',
            },
            rightStyle:{
                width: 'calc( 100% - 250px)',
            },
        }
    },
        mounted(){
            this.setStyle(this.collapse);
        },
        methods:{
            setStyle(nval){
                if(nval){
                    this.leftStyle = {
                        width: '65px',
                    };
                    this.rightStyle = {
                        width: 'calc( 100% - 65px)',
                    };
                }else{
                    this.leftStyle = {
                        width: '250px'
                    };
                    this.rightStyle = {
                        width: 'calc( 100% - 250px)'
                    };
                }
            }
        },
    
}
</script>
<style lang="scss" scoped>
    .homeCon {
        height: 100vh;        
        .bottomPart {
            width: 100%;
            height: calc( 100vh - 70px );
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;
            .leftCon {
                width: 65px;
                height: 100%;
                transition-property: all;
                transition-duration: 0.3s;
            }
            .rightCon {
                overflow-y: scroll;
                background-color: #f0f0f0;
                height: 100%;
                width: calc( 100% - 65px);
                transition-property: all;
                transition-duration: 0.3s;
            }
        }
    }
</style>