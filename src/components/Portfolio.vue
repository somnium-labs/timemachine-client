<template>
    <ejs-grid ref="portfolioComponent" :dataSource="data">
        <e-columns>
            <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
            <e-column field="assetName" headerText="Name" textAlign="left"></e-column>
            <e-column field="volume" headerText="Volume" textAlign="left"></e-column>
            <e-column field="ratio" headerText="Ratio" textAlign="left"></e-column>
            <e-column field="price" headerText="Price" textAlign="left"></e-column>
        </e-columns>
    </ejs-grid>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { SharedModel } from '../model/SharedModel';
import { GridPlugin, GridComponent } from '@syncfusion/ej2-vue-grids';

Vue.use(GridPlugin);

@Component
export default class Portfolio extends Vue {
    private data: any[] = [];
    private dataObserver: any[] = [];

    public async addPortfolio(portfolio: SharedModel.Subject[]) {
        const assetInfo: any[] = [];
        portfolio.forEach((x: SharedModel.Subject) => {
            assetInfo.push({ assetCode: x.assetCode, exchange: x.exchange });
        });

        const response = await axios({
            url: 'https://localhost:5001/api/values/OpenPrice',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                assets: assetInfo,
                startDate: this.$store.state.option.startDate
            }
        });

        const gridComponent = this.$refs.portfolioComponent as GridComponent;
        gridComponent.startEdit();

        const data = response.data.data;
        data.forEach((x: any) => {
            const element = {
                assetCode: x.assetCode,
                assetName: x.assetName,
                volume: 0,
                ratio: 0,
                price: x.openPrice
            };
            this.data.push(element);
        });

        gridComponent.endEdit();
        gridComponent.updated();

        // this.data = this.dataObserver;
    }
}
</script>