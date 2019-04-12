<template>
    <div>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs content-class="mt-3">
            <b-tab title="Summary" active>
                <ejs-grid
                    ref="grid"
                    :dataSource="parentData"
                    :childGrid="childGrid"
                    :dataBound="onDataBound"
                >
                    <e-columns>
                        <e-column field="subjectType" headerText="Type" textAlign="left"></e-column>
                        <e-column field="strategyType" headerText="Strategy" textAlign="left"></e-column>
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
                        <e-column field="mddRatio" headerText="MDD" textAlign="left" format="P2"></e-column>
                        <e-column
                            field="sharpeRatio"
                            headerText="Sharpe Ratio"
                            textAlign="left"
                            format="#,##.##"
                        ></e-column>
                    </e-columns>
                </ejs-grid>
                <ejs-chart
                    ref="chart"
                    style="display:block;"
                    :loaded="onChartLoad"
                    :primaryXAxis="primaryXAxis"
                    :theme="theme"
                >
                    <e-series-collection>
                        <e-series
                            :dataSource="seriesData"
                            :marker="marker"
                            :xName="xName"
                            :yName="yName"
                            :animation="animation"
                            type="Line"
                        ></e-series>
                    </e-series-collection>
                </ejs-chart>
            </b-tab>
        </b-tabs>
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
    ContextMenu,
    DetailRow
} from '@syncfusion/ej2-vue-grids';
import { TabPlugin, TabComponent } from '@syncfusion/ej2-vue-navigations';
import { ChartPlugin, LineSeries, Legend } from "@syncfusion/ej2-vue-charts";


Vue.use(TabPlugin);
Vue.use(GridPlugin);
Vue.use(ChartPlugin);

@Component({
    provide: {
        grid: [DetailRow]
    },
    props: {
        startDate: String,
        endDate: String
    }
})
export default class Report extends Vue {
    private summaryDetails: any[] = [];

    public data() {
        return {
            parentData: [],
            childGrid: {
                dataSource: [],
                queryString: 'relationalKey',
                columns: [
                    { field: 'assetName', headerText: 'Name' },
                    { field: 'assetCode', headerText: 'Code' },
                    {
                        field: 'initialBalance',
                        headerText: 'Initial Balance',
                        format: '¥#,##'
                    },
                    {
                        field: 'endBalance',
                        headerText: 'Final Balance',
                        format: '¥#,##'
                    },
                    {
                        field: 'commission',
                        headerText: 'Commission',
                        format: '¥#,##.#'
                    },
                    {
                        field: 'periodReturnRatio',
                        headerText: 'Period Returns',
                        format: 'P2'
                    },
                    { field: 'mddRatio', headerText: 'MDD', format: 'P2' }
                ]
            }
        };
    }

    public CreateReport(data: any) {
        const temp: any[] = [];
        const summaryDetails: any[] = [];

        for (const k in data.data) {
            const v = data.data[k];
            temp.push(v.summary);

            v.summary.summaryDetails.forEach((x: any) => {
                summaryDetails.push(x);
            });
        }

        const gridComponent = this.$refs.grid as GridComponent;
        gridComponent.ej2Instances.dataSource = temp;
        gridComponent.ej2Instances.childGrid.dataSource = summaryDetails;

        console.log(summaryDetails);
    }

    private onDataBound() {
        const gridComponent = this.$refs.grid as GridComponent;
        gridComponent.ej2Instances.detailRowModule.expandAll();
    }
}
</script>