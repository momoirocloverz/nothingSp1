<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="activeIndex" :collapse="collapse" background-color='#545c64' @open="handleOpen" @close="handleClose"
            text-color="#fff" mode="vertical" active-text-color="#20a0ff" unique-opened >
           <template v-for="(item,i) in menuList">
               <template>
                   <el-menu-item :index="item.index" :key="i" @click="pushTo(item)">
                        <template>
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                    </el-menu-item>
                </template>
               
<!--
                <template v-if="item.subs&&item.subs.length">
                    <el-submenu :index="item.index" :key="i">
                        <template>
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-if="item.subs&&item.subs.length===0">
                    <el-menu-item :index="item.index" :key="i">
                        <template>
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                    </el-menu-item>
                </template>
-->
            </template>
        </el-menu>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                menuList:[
                    { 
                        title:'资讯管理',
                        index:'1-1',
                        icon:'el-icon-tickets',
                        name:'InfoManage',
                    },
                    { 
                        title:'官网预约',
                        index:'2-1',
                        icon:'el-icon-tickets',
                        name:'officialAppoint',
                    },
                    {
                        title:'消息管理',
                        index:'3-1',
                        icon:'el-icon-tickets',
                        name:'messageManage',
                    },
//                    { 
//                        title:'客服设置',
//                        index:'3-1',
//                        icon:'el-icon-tickets',
//                        name:'serviceConfig',
//                    },
                ],
            }
        },
        computed: {
            ...mapGetters({
                collapse:'getCollapse',
                activeIndex:'getMenuIndex',
            })
        },
        mounted(){
            this.getMenu();
        },
        methods:{
            getMenu(){
                let identity = sessionStorage.getItem('identity');
                if( identity == '1' ){
                    this.$router.push({name: 'serviceConfig'});
                    this.menuList = [
                        { 
                            title:'客服设置',
                            index:'3-1',
                            icon:'el-icon-tickets',
                            name:'serviceConfig',
                        },
                    ];
                }else{                    
                    this.menuList = [
                        {
                            title:'资讯管理',
                            index:'1-1',
                            icon:'el-icon-tickets',
                            name:'InfoManage',
                        },
                        {
                            title:'官网预约',
                            index:'2-1',
                            icon:'el-icon-tickets',
                            name:'officialAppoint',
                        },
                        {
                            title:'消息管理',
                            index:'3-1',
                            icon:'el-icon-tickets',
                            name:'messageManage',
                        },
                    ];
                }
            },
            pushTo(item){
                this.$router.push({name:item.name});
                this.$store.commit('changeMenuIndex',item.index);
            },
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
        }
    }
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>