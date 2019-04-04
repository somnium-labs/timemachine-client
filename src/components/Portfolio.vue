<template>
    <ejs-grid
        ref="portfolioComponent"
        :dataSource="data"
        :editSettings="settings"
        :contextMenuItems="contextMenuItems"
        :contextMenuClick="contextMenuClick"
        :selectionSettings="selectionOptions"
    >
        <e-columns>
            <e-column isPrimaryKey="true" field="assetCode" headerText="Code" textAlign="left"></e-column>
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
import { TS } from 'typescript-linq';
import { SharedModel } from '../model/SharedModel';
import {
    GridPlugin,
    GridComponent,
    Edit,
    ContextMenu
} from '@syncfusion/ej2-vue-grids';

Vue.use(GridPlugin);

@Component({
    provide: {
        grid: [Edit, ContextMenu]
    }
})
export default class Portfolio extends Vue {
    private data: any[] = [];
    private portfolio: TS.Collections.Dictionary<
        string,
        any
    > = new TS.Collections.Dictionary<string, any>();
    private selectionOptions = { type: 'Multiple' };
    private contextMenuItems = [
        { text: 'Remove Portfolio', id: 'removePortfolio' }
    ];
    private settings = {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true
    };

    public test() {
        alert('test');
    }

    public async addPortfolio(universe: SharedModel.Subject[]) {
        const assetInfo: any[] = [];
        universe.forEach((x: SharedModel.Subject) => {
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

        const data = response.data.data;
        data.forEach((x: any) => {
            if (!this.portfolio.containsKey(x.assetCode)) {
                const record = {
                    assetCode: x.assetCode,
                    assetName: x.assetName,
                    volume: 0,
                    ratio: 0,
                    price: x.openPrice
                };
                this.addRecord(record);
            }
        });
    }

    public analyzePortfolio() {
        const assetInfo: any[] = [];
        this.portfolio.forEach((x: any) => {
            const asset = {
                assetCode: x.value.assetCode,
                ratio: x.value.ratio
            };
            assetInfo.push(asset);
        });

        axios({
            url: 'https://localhost:5001/api/values/AnalyzePortfolio',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                portfolio: assetInfo,
                startDate: this.$store.state.option.startDate,
                endDate: this.$store.state.option.endDate,
                capital: this.$store.state.option.capital,
                benchmark: this.$store.state.option.benchmark,
                commissionType: this.$store.state.option.commissionType,
                commission: this.$store.state.option.commission,
                slippageType: this.$store.state.option.slippageType,
                slippage: this.$store.state.option.slippage,
                orderVolumeType: this.$store.state.option.tradeType,
                allowDecimalPoint: this.$store.state.option.usePointVolume,
                AllowLeverage: this.$store.state.option.useOutstandingBalance
            }
        });
    }

    private addRecord(record: any) {
        const gridComponent = this.$refs.portfolioComponent as GridComponent;
        gridComponent.addRecord(record);
        this.portfolio.add(record.assetCode, {
            assetCode: record.assetCode,
            assetName: record.assetName,
            volume: record.volume,
            ratio: record.ratio,
            price: record.openPrice
        });
    }

    private removeRecord() {
        const gridComponent = this.$refs.portfolioComponent as GridComponent;
        gridComponent.deleteRecord();
        const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];
        selectedrecords.forEach((subject: SharedModel.Subject) => {
            this.portfolio.remove(subject.assetCode);
        });
    }

    private async contextMenuClick(args: any) {
        if (args.item.id === 'removePortfolio') {
            this.removeRecord();
        }
    }
}
</script>