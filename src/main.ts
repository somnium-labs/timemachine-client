import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import MultiFiltersPlugin from './plugins/MultiFilters';

Vue.config.productionTip = false;

Vue.use(MultiFiltersPlugin);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
