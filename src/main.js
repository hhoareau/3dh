import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css'; // This line here
import App from '../node_modules/@babel/App.vue';
import './registerServiceWorker';
import Files from "./components/Files.vue";
Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.config.silent = true;
const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Files },
        { path: '/:api', component: Files }
    ]
});
const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
//# sourceMappingURL=main.js.map