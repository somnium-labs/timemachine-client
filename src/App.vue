<template>
    <v-app>
        <v-toolbar>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>TimeMachine</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat to="/">Setting</v-btn>
                <v-btn flat to="/report">Report</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<!-- Material theme used for this sample -->
<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-grids/styles/material.css';
</style>