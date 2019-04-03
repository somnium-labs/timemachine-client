<template>
    <v-app>
        <v-toolbar>
            <v-toolbar-side-icon @click="toggleSidebar"></v-toolbar-side-icon>
            <v-toolbar-title>TimeMachine</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat to="/">Setting</v-btn>
                <v-btn flat to="/report">Report</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view ref="routerComponent"/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Home from './views/Home.vue';

@Component
export default class App extends Vue {
    private toggleSidebar() {
        if (this.$route.name === 'home') {
            const homeComponent = this.$refs.routerComponent as Home;
            homeComponent.toggleSidebar();
        }
    }
}
</script>

<!-- Material theme -->
<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-lists/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-richtexteditor/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-inplace-editor/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-grids/styles/material.css';
</style>