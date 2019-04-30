<template>
    <div>
        <br>
        <br>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs v-model="selectedTab">
            <b-tab title="Summary" active>
                <ejs-grid
                    ref="summary"
                    id="reportGrid"
                    :dataSource="parentData"
                    :childGrid="childGrid"
                    :dataBound="onDataBound"
                    :toolbar="toolbar"
                    :allowExcelExport="true"
                    :toolbarClick="toolbarClick"
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
                    ref="annualReturnsChart"
                    style="display:block"
                    :zoomSettings="zoomSettings"
                    :crosshair="crosshair"
                    title="Annual Returns"
                    :primaryXAxis="annualReturnsXAxis"
                    :primaryYAxis="annualReturnsYAxis"
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
            <b-tab title="Records">
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
                        <b-badge variant="warning">Moving Average</b-badge>
                    </h5>
                    <Record ref="movingAverage"/>
                </div>
            </b-tab>
            <b-tab title="Annual Returns">
                <ejs-grid ref="annualReturnsGrid">
                    <e-columns>
                        <e-column field="year" headerText="Year" textAlign="left"></e-column>
                        <e-column
                            field="benchmark"
                            headerText="Benchmark"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showBuyAndHold"
                            field="buyAndHold"
                            headerText="Buy And Hold"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showVolatilityBreakout"
                            field="volatilityBreakout"
                            headerText="Volatility Breakout"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showMovingAverage"
                            field="movingAverage"
                            headerText="MovingAverage"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                    </e-columns>
                </ejs-grid>
            </b-tab>
            <b-tab title="Monthly Returns">
                <ejs-grid ref="monthlyReturnsGrid">
                    <e-columns>
                        <e-column field="date" headerText="Date" textAlign="left"></e-column>
                        <e-column
                            field="benchmark"
                            headerText="Benchmark"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showBuyAndHold"
                            field="buyAndHold"
                            headerText="Buy And Hold"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showVolatilityBreakout"
                            field="volatilityBreakout"
                            headerText="Volatility Breakout"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                        <e-column
                            v-if="showMovingAverage"
                            field="movingAverage"
                            headerText="MovingAverage"
                            textAlign="left"
                            format="P2"
                        ></e-column>
                    </e-columns>
                </ejs-grid>
            </b-tab>
            <b-tab title="Transaction">
                <div>
                    <br>
                    <h5>
                        <b-badge variant="warning">Benchmark</b-badge>
                    </h5>
                    <Transaction ref="benchmarkTransaction"/>
                </div>
                <div v-show="showBuyAndHold">
                    <br>
                    <h5>
                        <b-badge variant="warning">Buy And Hold</b-badge>
                    </h5>
                    <Transaction ref="buyAndHoldTransaction"/>
                </div>
                <div v-show="showVolatilityBreakout">
                    <br>
                    <h5>
                        <b-badge variant="warning">Volatility Breakout</b-badge>
                    </h5>
                    <Transaction ref="volatilityBreakoutTransaction"/>
                </div>
                <div v-show="showMovingAverage">
                    <br>
                    <h5>
                        <b-badge variant="warning">Moving Average</b-badge>
                    </h5>
                    <Transaction ref="movingAverageTransaction"/>
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
import Transaction from '@/components/Transaction.vue';
import {
    ChartComponent,
    ChartPlugin,
    LineSeries,
    ColumnSeries,
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
    DetailRow,
    ExcelExport,
    Toolbar
} from '@syncfusion/ej2-vue-grids';
import { TabPlugin, TabComponent } from '@syncfusion/ej2-vue-navigations';
import moment from 'moment';

Vue.use(TabPlugin);
Vue.use(GridPlugin);
Vue.use(ChartPlugin);

@Component({
    components: {
        Record,
        Transaction
    },
    provide: {
        chart: [
            LineSeries,
            ColumnSeries,
            Legend,
            Tooltip,
            DateTime,
            Zoom,
            ScrollBar,
            Crosshair
        ],
        grid: [DetailRow, ExcelExport, Toolbar]
    },
    props: {
        startDate: String,
        endDate: String
    }
})
export default class Report extends Vue {
    private summaryDetails: any[] = [];
    private theme: string = 'Bootstrap'; // fabric, Material, HighContrast, Bootstrapv4
    private toolbar = ['ExcelExport'];

    private showBuyAndHold: boolean = false;
    private showVolatilityBreakout: boolean = false;
    private showMovingAverage: boolean = false;

    private transactions: any[] = [];

    private selectedTab: number = 0;

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

    private annualReturnsXAxis = {
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        interval: 1,
        lineStyle: { width: 0 },
        labelIntersectAction: 'Rotate45',
        labelFormat: 'n0'
        // valueType: 'Category'
    };

    private annualReturnsYAxis = {
        title: 'Annual Return',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: 'p2'
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

    public InitializeTab() {
        this.selectedTab = 0;
    }

    public CreateReport(data: any) {
        this.showBuyAndHold = this.$store.state.option.useBuyAndHold;
        this.showVolatilityBreakout = this.$store.state.option.useVolatilityBreakout;
        this.showMovingAverage = this.$store.state.option.useMovingAverage;

        const summaryBuffer: any[] = [];
        const recordBuffer: any[] = [];
        const annualReturnsBuffer: any[] = [];

        const annualReturnDatas: any = [];
        const monthlyReturnDatas: any = [];

        const summaryDetails: any[] = [];
        const cumulativeReturnRatioChartComponent = this.$refs
            .cumulativeReturnRatioChart as ChartComponent;
        const mddChartComponent = this.$refs.mddChart as ChartComponent;
        const totalBalanceChartComponent = this.$refs
            .totalBalanceChart as ChartComponent;
        const annualReturnsChartComponent = this.$refs
            .annualReturnsChart as ChartComponent;

        const series1: any[] = [];
        const series2: any[] = [];
        const series3: any[] = [];

        const annualSeries: any[] = [];

        data.data.forEach((v: any) => {
            summaryBuffer.push(v.summary);
            annualReturnsBuffer.push(v.annualReturns);

            this.createTransaction(
                v.transactions,
                v.summary.subjectType,
                v.strategyType
            );

            if (v.summary.subjectType === '벤치마크') {
                const component = this.$refs.benchmark as Record;
                component.createRecords(v.records);
                v.annualReturns.forEach((x: any) => {
                    annualReturnDatas.push({
                        year: x.year,
                        benchmark: x.returnRatio,
                        buyAndHold: 0,
                        volatilityBreakout: 0,
                        movingAverage: 0
                    });
                });
                v.monthlyReturns.forEach((x: any) => {
                    monthlyReturnDatas.push({
                        date: x.date,
                        benchmark: x.returnRatio,
                        buyAndHold: 0,
                        volatilityBreakout: 0,
                        movingAverage: 0
                    });
                });
            } else if (v.strategyType === 'Buy And Hold') {
                const component = this.$refs.buyAndHold as Record;
                component.createRecords(v.records);
                v.annualReturns.forEach((x: any) => {
                    const element = annualReturnDatas.find((annual: any) => {
                        return annual.year === x.year;
                    });
                    element.buyAndHold = x.returnRatio;
                });
                v.monthlyReturns.forEach((x: any) => {
                    const element = monthlyReturnDatas.find((annual: any) => {
                        return annual.date === x.date;
                    });
                    element.buyAndHold = x.returnRatio;
                });
            } else if (v.strategyType === 'Volatility Breakout') {
                const component = this.$refs.volatilityBreakout as Record;
                component.createRecords(v.records);
                v.annualReturns.forEach((x: any) => {
                    const element = annualReturnDatas.find((annual: any) => {
                        return annual.year === x.year;
                    });
                    element.volatilityBreakout = x.returnRatio;
                });
                v.monthlyReturns.forEach((x: any) => {
                    const element = monthlyReturnDatas.find((annual: any) => {
                        return annual.date === x.date;
                    });
                    element.volatilityBreakout = x.returnRatio;
                });
            } else if (v.strategyType === 'Moving Average') {
                const component = this.$refs.movingAverage as Record;
                component.createRecords(v.records);
                v.annualReturns.forEach((x: any) => {
                    const element = annualReturnDatas.find((annual: any) => {
                        return annual.year === x.year;
                    });
                    element.movingAverage = x.returnRatio;
                });
                v.monthlyReturns.forEach((x: any) => {
                    const element = monthlyReturnDatas.find((annual: any) => {
                        return annual.date === x.date;
                    });
                    element.movingAverage = x.returnRatio;
                });
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

            const annualData = {
                type: 'Column',
                width: '100%',
                name:
                    v.summary.subjectType === '벤치마크'
                        ? 'Benchmark'
                        : v.summary.strategyType,
                dataSource: v.annualReturns,
                xName: 'year',
                yName: 'returnRatio',
                legendShape: 'Circle'
            };
            annualSeries.push(annualData);
        });

        // clear
        cumulativeReturnRatioChartComponent.ej2Instances.series = [];
        mddChartComponent.ej2Instances.series = [];
        totalBalanceChartComponent.ej2Instances.series = [];
        annualReturnsChartComponent.ej2Instances.series = [];

        cumulativeReturnRatioChartComponent.ej2Instances.addSeries(series1);
        mddChartComponent.ej2Instances.addSeries(series2);
        totalBalanceChartComponent.ej2Instances.addSeries(series3);
        annualReturnsChartComponent.ej2Instances.addSeries(annualSeries);

        const summaryComponent = this.$refs.summary as GridComponent;
        summaryComponent.ej2Instances.dataSource = summaryBuffer;
        summaryComponent.ej2Instances.childGrid.dataSource = summaryDetails;

        const annualReturnsGridComponent = this.$refs
            .annualReturnsGrid as GridComponent;
        annualReturnsGridComponent.ej2Instances.dataSource = annualReturnDatas;

        const monthlyReturnsGridComponent = this.$refs
            .monthlyReturnsGrid as GridComponent;
        monthlyReturnsGridComponent.ej2Instances.dataSource = monthlyReturnDatas;
    }

    // @Watch('showBuyAndHold', { deep: true })
    // private show() {
    //     const component = this.$refs.buyAndHold as Record;
    //     component.createRecords(v.records);
    // }

    private createTransaction(
        transaction: any,
        subjectType: string,
        strategyType: string
    ) {
        let transactionComponent = this.$refs
            .benchmarkTransaction as Transaction;

        if (subjectType === '벤치마크') {
            transactionComponent = this.$refs
                .benchmarkTransaction as Transaction;
        } else if (strategyType === 'Buy And Hold') {
            transactionComponent = this.$refs
                .buyAndHoldTransaction as Transaction;
        } else if (strategyType === 'Volatility Breakout') {
            transactionComponent = this.$refs
                .volatilityBreakoutTransaction as Transaction;
        } else if (strategyType === 'Moving Average') {
            transactionComponent = this.$refs
                .movingAverageTransaction as Transaction;
        }

        const transactions: any[] = [];
        const assetCodes = Object.keys(transaction);
        assetCodes.forEach((assetCode: string) => {
            const dates = Object.keys(transaction[assetCode]);
            dates.forEach((date: string) => {
                transaction[assetCode][date].forEach((x: any) => {
                    x.side = x.side === 0 ? 'SELL' : 'BUY';
                    x.total = x.price * x.volume;
                    transactions.push(x);
                });
            });
        });

        transactionComponent.createTransactions(transactions);
    }

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
        const gridComponent = this.$refs.summary as GridComponent;
        gridComponent.ej2Instances.detailRowModule.expandAll();
    }

    private toolbarClick(args: any) {
        if (args.item.id === 'reportGrid_excelexport') {
            const gridComponent = this.$refs.summary as GridComponent;
            gridComponent.excelExport();
        }
    }
}
</script>