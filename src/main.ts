import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import MultiFiltersPlugin from './plugins/MultiFilters';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(MultiFiltersPlugin);
Vue.use(BootstrapVue);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
