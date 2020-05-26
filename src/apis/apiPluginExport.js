import apis from './apis.js';
export default {
    install: function(Vue) {
	   Object.defineProperty(Vue.prototype, 'Apis' , { value: apis });
	 }
}