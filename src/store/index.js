import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        sidebarCollapse:false,
        menuActiveIndex:'1-1',
    },
    getters:{
        getCollapse:(state) => {
            return state.sidebarCollapse
        },
        getMenuIndex:(state) => {
            return state.menuActiveIndex
        },
    },
    mutations: {
        changeCollapse (state, payload) {
            state.sidebarCollapse = payload
        },
        changeMenuIndex(state, payload){
            state.menuActiveIndex = payload
        },
    },
    actions: {
        
    },
    plugins: [vuexLocal.plugin],
})
