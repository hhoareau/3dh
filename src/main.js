import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css'; // This line here
import App from '../node_modules/@babel/App.vue';
import './registerServiceWorker';
Vue.use(VueMaterial);
Vue.config.productionTip = false;
Vue.config.silent = true;
new Vue({
    render: h => h(App)
}).$mount('#app');
//# sourceMappingURL=main.js.map