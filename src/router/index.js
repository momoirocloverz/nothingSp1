import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/login.vue';
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    children:[
          {
            path: '/InfoManage',
            name: 'InfoManage',
            component: () => import('@/views/infoManage/infoManage.vue'),
          },
        {
            path: '/infoEditor',
            name: 'infoEditor',
            component: () => import('@/views/infoManage/infoEditor.vue'),
          },
        {
            path: '/messageManage',
            name: 'messageManage',
            component: () => import('@/views/messageManage/infoManage.vue'),
        },
        {
            path: '/messageEditor',
            name: 'messageEditor',
            component: () => import('@/views/messageManage/infoEditor.vue'),
        },
         {
            path: '/officialAppoint',
            name: 'officialAppoint',
            component: () => import('@/views/officialAppoint/officialAppoint.vue'),
          },
            {
            path: '/serviceConfig',
            name: 'serviceConfig',
            component: () => import('@/views/serviceConfig/serviceConfig.vue'),
          },
            {
            path: '/serviceEditor',
            name: 'serviceEditor',
            component: () => import('@/views/serviceConfig/serviceEditor.vue'),
          },
      ],  
  }
];
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token");
    if( to.path=='/login' ){
        next();
    }else{
        if( token ){
            next();
        }else{
            next({path:"/login"})
        }
    }
})
export default router