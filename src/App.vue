<template>
    <v-app style="background-color: #212121;">
        <!--
        <v-toolbar>
            <v-toolbar-side-icon @click="toggleSidebar"></v-toolbar-side-icon>
            <v-toolbar-title>TimeMachine</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat to="/">Setting</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        -->
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

    // @import '../node_modules/@syncfusion/ej2-vue-grids/styles/material-dark.css';
}
</script>

<!-- Material theme -->
<style>
@import '../styles/material-dark.css';
</style>