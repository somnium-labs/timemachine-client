<template>
    <ejs-grid :dataSource="data">
        <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
        <e-column
            field="assetName"
            headerText="Name"
            textAlign="left"
            clipMode="EllipsisWithTooltip"
        ></e-column>
    </ejs-grid>
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
}
</script>