<template>
    <div>
        <H3>Portfolio</H3>
        <ejs-grid
            ref="portfolioComponent"
            :dataSource="data"
            :editSettings="settings"
            :contextMenuItems="contextMenuItems"
            :contextMenuClick="contextMenuClick"
            :selectionSettings="selectionOptions"
            :rowDataBound="changeRecord"
        >
            <e-columns>
                <e-column isPrimaryKey="true" field="assetCode" headerText="Code" textAlign="left"></e-column>
                <e-column
                    field="assetName"
                    headerText="Name"
                    textAlign="left"
                    :allowEditing="false"
                ></e-column>
                <e-column field="volume" headerText="Volume" textAlign="left" format="N1"></e-column>
                <e-column field="ratio" headerText="Ratio" textAlign="left" format="P2"></e-column>
                <e-column field="price" headerText="Price" textAlign="left" :allowEditing="false"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
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

    public async addPortfolio(universe: SharedModel.Subject[]) {
        const assetInfo: any[] = [];
        universe.forEach((x: SharedModel.Subject) => {
            if (!this.portfolio.containsKey(x.assetCode)) {
                assetInfo.push({
                    assetCode: x.assetCode,
                    exchange: x.exchange
                });
            }
        });

        const response = await axios({
            url: `${this.$store.state.url}/api/values/OpenPrice`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                assets: assetInfo,
                startDate: this.$store.state.option.startDate
            }
        });

        const data = response.data.data;
        const count = data.length + this.portfolio.count();

        data.forEach((x: any) => {
            const newRatio = 1 / count;
            const newPrice = x.openPrice;
            const newVolume =
                (this.$store.state.option.capital * newRatio) / newPrice;
            const record = {
                assetCode: x.assetCode,
                assetName: x.assetName,
                volume: newVolume,
                ratio: newRatio,
                price: newPrice
            };
            this.addRecord(record);
        });

        // const temp: any[] = [];
        // this.portfolio.forEach((x: any) => {
        //     x.value.ratio = 1 / count;
        //     x.value.volume =
        //         (this.$store.state.option.capital * x.value.ratio) /
        //         x.value.price;

        //     temp.push(x.value);
        // });

        // this.data = temp;
    }

    public async analyzePortfolio() {
        const assetInfo: any[] = [];
        this.portfolio.forEach((x: any) => {
            const asset = {
                assetCode: x.value.assetCode,
                volume: x.value.volume,
                ratio: x.value.ratio
            };
            assetInfo.push(asset);
        });

        const result = await axios({
            url: `${this.$store.state.url}/api/values/AnalyzePortfolio`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                portfolio: assetInfo,
                startDate: this.$store.state.option.startDate,
                endDate: this.$store.state.option.endDate,
                capital: this.$store.state.option.capital,
                benchmark: {
                    assetCode: this.$store.state.option.benchmark,
                    volume: 0,
                    ratio: 1 // TODO: 옵션으로 뺴야 할듯
                },
                commissionType: this.$store.state.option.commissionType,
                commission: this.$store.state.option.commission,
                slippageType: this.$store.state.option.slippageType,
                slippage: this.$store.state.option.slippage,
                orderVolumeType: this.$store.state.option.tradeType,
                allowDecimalPoint: this.$store.state.option.usePointVolume,
                AllowLeverage: this.$store.state.option.useOutstandingBalance,
                useBuyAndHold: this.$store.state.option.useBuyAndHold,
                useVolatilityBreakout: this.$store.state.option
                    .useVolatilityBreakout,
                useMovingAverage: this.$store.state.option.useMovingAverage
            }
        });

        return result;
    }

    public refreshPortfolio() {
        const temp: any[] = [];
        this.portfolio.forEach((x: any) => {
            x.value.ratio = 1 / this.portfolio.count();
            x.value.volume =
                (this.$store.state.option.capital * x.value.ratio) /
                x.value.price;

            temp.push(x.value);
        });

        this.data = temp;
    }

    private addRecord(record: any) {
        this.portfolio.add(record.assetCode, {
            assetCode: record.assetCode,
            assetName: record.assetName,
            volume: record.volume,
            ratio: record.ratio,
            price: record.price
        });

        this.refreshPortfolio();
    }

    private removeRecord() {
        const gridComponent = this.$refs.portfolioComponent as GridComponent;
        gridComponent.deleteRecord();
        const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];
        selectedrecords.forEach((subject: SharedModel.Subject) => {
            this.portfolio.remove(subject.assetCode);
        });

        this.refreshPortfolio();
    }

    private async contextMenuClick(args: any) {
        if (args.item.id === 'removePortfolio') {
            this.removeRecord();
        }
    }

    private changeRecord(args: any) {
        // const assetCode = args.data.assetCode;
        // const ratio = args.data.ratio;
        // const volume = args.data.volume;
        // const oldRatio = this.portfolio.getValue(assetCode).ratio;
        // const oldVolume = this.portfolio.getValue(assetCode).volume;
        // if (oldRatio !== ratio) {
        //     this.portfolio.getValue(assetCode).ratio = ratio;
        // }
        // if (oldVolume !== volume) {
        //     this.portfolio.getValue(assetCode).volume = volume;
        // }
        // const gridComponent = this.$refs.portfolioComponent as GridComponent;
        // gridComponent.setCellValue(assetCode, 'volume', 20);
    }
}
</script>