<template>
    <div>
        <br>
        <br>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs>
            <b-tab title="Summary" active>
                <ejs-grid
                    ref="summary"
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
                <br>
                <br>
                <br>
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
                    :theme="theme"
                    width="90%"
                ></ejs-chart>
                <br>
                <br>
                <br>
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
                    :theme="theme"
                    width="90%"
                ></ejs-chart>
                <br>
                <br>
                <br>
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
                    :theme="theme"
                    width="90%"
                ></ejs-chart>
            </b-tab>
            <b-tab title="Detail">
                <div>
                    <br>
                    <h5>
                        <b-badge variant="warning">Benchmark</b-badge>
                    </h5>
                    <Record ref="benchmark"/>
                </div>
                <div v-show="showBuyAndHold">
                    <br>
                    <h5>
                        <b-badge variant="warning">Buy And Hold</b-badge>
                    </h5>
                    <Record ref="buyAndHold"/>
                </div>
                <div v-show="showVolatilityBreakout">
                    <br>
                    <h5>
                        <b-badge variant="warning">Volatility Breakout</b-badge>
                    </h5>
                    <Record ref="volatilityBreakout"/>
                </div>
                <div v-show="showMovingAverage">
                    <br>
                    <h5>
                        <b-badge variant="warning">Show Moving Average</b-badge>
                    </h5>
                    <Record ref="movingAverage"/>
                </div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
    Provide,
    Inject,
    Watch
} from 'vue-property-decorator';
import { Browser } from '@syncfusion/ej2-base';
import axios from 'axios';
import { TS } from 'typescript-linq';
import { SharedModel } from '../model/SharedModel';
import Record from '@/components/Record.vue';
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
import moment from 'moment';

Vue.use(TabPlugin);
Vue.use(GridPlugin);
Vue.use(ChartPlugin);

@Component({
    components: {
        Record
    },
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
        grid: [DetailRow]
    },
    props: {
        startDate: String,
        endDate: String
    }
})
export default class Report extends Vue {
    private summaryDetails: any[] = [];
    private theme: string = 'Bootstrap'; // fabric, Material, HighContrast, Bootstrapv4

    private showBuyAndHold: boolean = false;
    private showVolatilityBreakout: boolean = false;
    private showMovingAverage: boolean = false;

    private primaryXAxis = {
        valueType: 'DateTime',
        labelFormat: 'yy-MM',
        intervalType: 'Days',
        edgeLabelPlacement: 'Shift',
        majorGridLines: { width: 0 }
        // minimum: moment(this.$store.state.option.startDate as Date)
        //     .add('month', -2)
        //     .toDate(),
        // maximum: moment(this.$store.state.option.endDate as Date)
        //     .add('month', 2)
        //     .toDate()
        // crosshairTooltip: { enable: true }
    };

    private cumulativeReturnYAxis = {
        labelFormat: 'p2',
        rangePadding: 'None',
        // interval: 0.2,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
        // crosshairTooltip: { enable: true }
    };

    private mddYAxis = {
        labelFormat: 'p2',
        rangePadding: 'None',
        minimum: -1,
        maximum: 0,
        interval: 0.1,
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
        // interval: 50000,
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

    public CreateReport(data: any) {
        this.showBuyAndHold = this.$store.state.option.useBuyAndHold;
        this.showVolatilityBreakout = this.$store.state.option.useVolatilityBreakout;
        this.showMovingAverage = this.$store.state.option.useMovingAverage;

        const summaryBuffer: any[] = [];
        const recordBuffer: any[] = [];

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
            summaryBuffer.push(v.summary);

            if (v.summary.subjectType === '벤치마크') {
                const component = this.$refs.benchmark as Record;
                component.createRecords(v.records);
            }  else if (v.strategyType === 'Buy And Hold') {
                const component = this.$refs.buyAndHold as Record;
                component.createRecords(v.records);
            } else if (v.strategyType === 'Volatility Breakout') {
                const component = this.$refs.volatilityBreakout as Record;
                component.createRecords(v.records);
            } else if (v.strategyType === 'Moving Average') {
                const component = this.$refs.movingAverage as Record;
                component.createRecords(v.records);
            }

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
                yName: 'cumulativeReturnRatio',
                legendShape: 'Circle'
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
                yName: 'mdd',
                legendShape: 'Circle'
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
                yName: 'totalBalance',
                legendShape: 'Circle'
            };
            series3.push(data3);
        });

        // clear
        cumulativeReturnRatioChartComponent.ej2Instances.series = [];
        mddChartComponent.ej2Instances.series = [];
        totalBalanceChartComponent.ej2Instances.series = [];

        cumulativeReturnRatioChartComponent.ej2Instances.addSeries(series1);
        mddChartComponent.ej2Instances.addSeries(series2);
        totalBalanceChartComponent.ej2Instances.addSeries(series3);

        const summaryComponent = this.$refs.summary as GridComponent;
        summaryComponent.ej2Instances.dataSource = summaryBuffer;
        summaryComponent.ej2Instances.childGrid.dataSource = summaryDetails;
    }

    // @Watch('showBuyAndHold', { deep: true })
    // private show() {
    //     const component = this.$refs.buyAndHold as Record;
    //     component.createRecords(v.records);
    // }

    private data() {
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
                    {
                        field: 'annualReturn',
                        headerText: 'Annual Returns',
                        format: 'P2'
                    },
                    {
                        field: 'volatility',
                        headerText: 'Volatility',
                        format: 'P2'
                    },
                    { field: 'mddRatio', headerText: 'MDD', format: 'P2' },
                    {
                        field: 'sharpeRatio',
                        headerText: 'Sharpe Ratio'
                    }
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

    private onDataBound() {
        const gridComponent = this.$refs.grid as GridComponent;
        // gridComponent.ej2Instances.detailRowModule.expandAll();
    }
}
</script>