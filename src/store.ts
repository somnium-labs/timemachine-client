import Vue from 'vue';
import Vuex from 'vuex';

import option from './modules/optionModule';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    modules: {
        option,
    },
    actions: {},
});
