<template>
    <div>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs>
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
                    ref="cumulativeReturnRatioChart"
                    style="display:block"
                    :zoomSettings="zoomSettings"
                    :crosshair="crosshair"
                    title="Cumulative Returns"
                    :primaryXAxis="primaryXAxis"
                    :primaryYAxis="cumulativeReturnYAxis"
                    :tooltip="tooltip"
                    :chartArea="chartArea"
                    :legendSettings="legendSettings"
                    width="100%"
                ></ejs-chart>
                <ejs-chart
                    ref="mddChart"
                    style="display:block"
                    :zoomSettings="zoomSettings"
                    :crosshair="crosshair"
                    title="MDD"
                    :primaryXAxis="primaryXAxis"
                    :primaryYAxis="mddYAxis"
                    :tooltip="tooltip"
                    :chartArea="chartArea"
                    :legendSettings="legendSettings"
                    width="100%"
                ></ejs-chart>
                <ejs-chart
                    ref="totalBalanceChart"
                    style="display:block"
                    :zoomSettings="zoomSettings"
                    :crosshair="crosshair"
                    title="Total Balance"
                    :primaryXAxis="primaryXAxis"
                    :primaryYAxis="totalBalanceYAxis"
                    :tooltip="tooltip"
                    :chartArea="chartArea"
                    :legendSettings="legendSettings"
                    width="100%"
                ></ejs-chart>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import { Browser } from '@syncfusion/ej2-base';
import axios from 'axios';
import { TS } from 'typescript-linq';
import { SharedModel } from '../model/SharedModel';
import {
    ChartComponent,
    ChartPlugin,
    LineSeries,
    Zoom,
    Tooltip,
    Crosshair,
    Legend,
    DateTime,
    ScrollBar
} from '@syncfusion/ej2-vue-charts';
import {
    GridPlugin,
    GridComponent,
    Edit,
    ContextMenu,
    DetailRow
} from '@syncfusion/ej2-vue-grids';
import { TabPlugin, TabComponent } from '@syncfusion/ej2-vue-navigations';

Vue.use(TabPlugin);
Vue.use(GridPlugin);
Vue.use(ChartPlugin);

@Component({
    provide: {
        chart: [
            LineSeries,
            Legend,
            Tooltip,
            DateTime,
            Zoom,
            ScrollBar,
            Crosshair
        ],
        grid: [
            DetailRow,
            LineSeries,
            DateTime,
            Legend,
            ScrollBar,
            Tooltip,
            Crosshair
        ]
    },
    props: {
        startDate: String,
        endDate: String
    }
})
export default class Report extends Vue {
    private summaryDetails: any[] = [];

    private primaryXAxis = {
        valueType: 'DateTime',
        labelFormat: 'yy-MM',
        intervalType: 'Days',
        edgeLabelPlacement: 'Shift',
        majorGridLines: { width: 0 },
        minimum: this.$store.state.option.startDate,
        maximum: this.$store.state.option.endDate
        // crosshairTooltip: { enable: true }
    };
    //Initializing Primary Y Axis
    private cumulativeReturnYAxis = {
        labelFormat: '{value}%',
        rangePadding: 'None',
        // minimum: 0,
        // maximum: 100,
        interval: 0.5,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
        // crosshairTooltip: { enable: true }
    };

    private mddYAxis = {
        labelFormat: '{value}%',
        rangePadding: 'None',
        // minimum: 0,
        // maximum: 100,
        interval: 0.5,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
        // crosshairTooltip: { enable: true }
    };

    private totalBalanceYAxis = {
        labelFormat: '{value}¥',
        rangePadding: 'None',
        minimum: 0,
        // maximum: 100,
        interval: 50000,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
        // crosshairTooltip: { enable: true }
    };

    private legendSettings = {
        visible: true,
        toggleVisibility: false,
        position: 'Top',
        height: '10%',
        width: '100%',
        textStyle: { size: 12, fontWeight: 'Bold' },
        margin: { left: 10, top: 0 },
        textOverflow: 'Wrap'
    };

    private zoomSettings = {
        mode: 'X',
        enableMouseWheelZooming: true,
        enablePinchZooming: true,
        enableSelectionZooming: true,
        enableScrollbar: true
    };

    data() {
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
            },
            crosshair: { enable: false },
            chartArea: {
                border: {
                    width: 0
                }
            },
            marker: {
                visible: false,
                height: 10,
                width: 10
            },
            tooltip: {
                enable: true
                // format: '${point.x}: <b>${point.y}</b>'
            },
            title: 'Inflation - Consumer Price'
        };
    }

    public CreateReport(data: any) {
        const temp: any[] = [];
        const summaryDetails: any[] = [];
        const cumulativeReturnRatioChartComponent = this.$refs
            .cumulativeReturnRatioChart as ChartComponent;
        const mddChartComponent = this.$refs.mddChart as ChartComponent;
        const totalBalanceChartComponent = this.$refs
            .totalBalanceChart as ChartComponent;

        const series1: any[] = [];
        const series2: any[] = [];
        const series3: any[] = [];

        data.data.forEach((v: any) => {
            temp.push(v.summary);

            v.summary.summaryDetails.forEach((x: any) => {
                summaryDetails.push(x);
            });

            const data1 = {
                type: 'Line',
                name:
                    v.summary.subjectType === '벤치마크'
                        ? 'Benchmark'
                        : v.summary.strategyType,
                dataSource: v.records,
                xName: 'date',
                yName: 'cumulativeReturnRatio'
            };
            series1.push(data1);

            const data2 = {
                type: 'Line',
                name:
                    v.summary.subjectType === '벤치마크'
                        ? 'Benchmark'
                        : v.summary.strategyType,
                dataSource: v.records,
                xName: 'date',
                yName: 'mdd'
            };
            series2.push(data2);

            const data3 = {
                type: 'Line',
                name:
                    v.summary.subjectType === '벤치마크'
                        ? 'Benchmark'
                        : v.summary.strategyType,
                dataSource: v.records,
                xName: 'date',
                yName: 'totalBalance'
            };
            series3.push(data3);
        });

        cumulativeReturnRatioChartComponent.ej2Instances.addSeries(series1);
        mddChartComponent.ej2Instances.addSeries(series2);
        totalBalanceChartComponent.ej2Instances.addSeries(series3);

        const gridComponent = this.$refs.grid as GridComponent;
        gridComponent.ej2Instances.dataSource = temp;
        gridComponent.ej2Instances.childGrid.dataSource = summaryDetails;

        // console.log(summaryDetails);
    }

    private onDataBound() {
        const gridComponent = this.$refs.grid as GridComponent;
        // gridComponent.ej2Instances.detailRowModule.expandAll();
    }
}
</script>