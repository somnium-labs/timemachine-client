<template>
    <ejs-grid :dataSource="data"></ejs-grid>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { SharedModel } from '../model/SharedModel';
import { GridPlugin } from '@syncfusion/ej2-vue-grids';

Vue.use(GridPlugin);

@Component
export default class Portfolio extends Vue {
    private data: any[] = [];

    public constructor() {
        super();
    }

    private async created() {
        this.data = [
            { OrderID: 10248, CustomerID: 'VINET', Freight: 32.38 },
            { OrderID: 10249, CustomerID: 'TOMSP', Freight: 11.61 },
            { OrderID: 10250, CustomerID: 'HANAR', Freight: 65.83 },
            { OrderID: 10251, CustomerID: 'VICTE', Freight: 41.34 },
            { OrderID: 10252, CustomerID: 'SUPRD', Freight: 51.3 },
            { OrderID: 10253, CustomerID: 'HANAR', Freight: 58.17 },
            { OrderID: 10254, CustomerID: 'CHOPS', Freight: 22.98 },
            { OrderID: 10255, CustomerID: 'RICSU', Freight: 148.33 },
            { OrderID: 10256, CustomerID: 'WELLI', Freight: 13.97 }
        ];
    }
}
</script>


<style>
@import '../../node_modules/@syncfusion/ej2-vue-grids/styles/material-dark.css';
</style>