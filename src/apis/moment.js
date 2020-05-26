import Moment from 'moment';
export default {
	install: function(Vue) {
	   Object.defineProperty(Vue.prototype, 'Moment' , { value: Moment });
	 }	
}