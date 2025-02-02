<template>
    <div>
        <ejs-grid
            ref="trend"
            id="trendGrid"
            :dataSource="data"
            :toolbar="toolbar"
            :allowExcelExport="true"
            :toolbarClick="toolbarClick"
            :allowSorting="true"
            :allowPaging="true"
            :pageSettings="pageSettings"
            :allowFiltering="true"
            :filterSettings="filterOptions"
        >
            <e-columns>
                <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
                <e-column field="assetName" headerText="Name" textAlign="left"></e-column>
                <e-column field="exchange" headerText="Exchange" textAlign="left" :filter="filter"></e-column>
                <e-column
                    field="sector"
                    headerText="Sector"
                    textAlign="left"
                    clipMode="EllipsisWithTooltip"
                    :filter="filter"
                ></e-column>
                <e-column
                    field="industry"
                    headerText="Industry"
                    textAlign="left"
                    clipMode="EllipsisWithTooltip"
                    :filter="filter"
                ></e-column>
                <e-column
                    field="marketCap"
                    headerText="Market Cap"
                    textAlign="left"
                    format="N0"
                    width="180"
                ></e-column>
                <e-column
                    field="firstDate"
                    headerText="First Date"
                    textAlign="left"
                    :format="formatOptions"
                    type="date"
                ></e-column>
                <e-column
                    field="initialBalance"
                    headerText="Initial Balance"
                    textAlign="left"
                    format="¥#,##"
                ></e-column>
                <e-column
                    field="endBalance"
                    headerText="Final Balance"
                    textAlign="left"
                    format="¥#,##"
                ></e-column>
                <e-column
                    field="commission"
                    headerText="Commission"
                    textAlign="left"
                    format="¥#,##.#"
                ></e-column>
                <e-column
                    field="transactions"
                    headerText="Transactions"
                    textAlign="left"
                    format="#,##"
                ></e-column>
                <e-column
                    field="periodReturnRatio"
                    headerText="Period Returns"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column
                    field="annualizedReturnRatio"
                    headerText="Annual Returns"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column
                    field="volatilityRatio"
                    headerText="Volatility"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column
                    field="priceVolatilityRatio"
                    headerText="Price Volatility"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column field="mddRatio" headerText="MDD" textAlign="left" format="P2"></e-column>
                <e-column
                    field="sharpeRatio"
                    headerText="Sharpe Ratio"
                    textAlign="left"
                    format="#,##.##"
                ></e-column>
                <e-column field="per" headerText="PER" textAlign="center"></e-column>
                <e-column field="pbr" headerText="PBR" textAlign="center"></e-column>
                <e-column field="evEvitda" headerText="EV/EVITDA" textAlign="center"></e-column>
                <e-column field="divYield" headerText="Div Yield" textAlign="center"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import {
    GridPlugin,
    GridComponent,
    Page,
    Filter,
    Sort,
    Toolbar,
    ExcelExport,
    ExcelExportProperties
} from '@syncfusion/ej2-vue-grids';
import moment from 'moment';

Vue.use(GridPlugin);

@Component({
    provide: {
        grid: [Page, Filter, Sort, Toolbar, ExcelExport]
    }
})
export default class Trend extends Vue {
    private data: any[] = [];
    private strategy: string = '';
    private date: string = '';

    private pageSettings = { pageSize: 20 };
    private toolbar = ['ExcelExport'];
    private formatOptions = { type: 'date', format: 'yyyy-MM-dd' };

    private filterOptions = { type: 'Menu' };
    private filter = { type: 'CheckBox' };

    public createTrend(strategy: string, date: string, data: any[]) {
        this.strategy = strategy;
        this.date = date;
        this.data = data;
    }

    private toolbarClick(args: any) {
        if (args.item.id === 'trendGrid_excelexport') {
            console.log('save');
            const gridComponent = this.$refs.trend as GridComponent;
            const exportProperties: ExcelExportProperties = {
                fileName: `${moment(this.$store.state.option
                    .startDate as Date).format('YYYYMMDD')}_${moment(this.$store
                    .state.option.endDate as Date).format('YYYYMMDD')}_(C)${
                    this.$store.state.option.commission
                }_(S)${this.$store.state.option.slippage}_${this.strategy}.xlsx`
            };
            gridComponent.excelExport(exportProperties);
        }
    }
}
</script>