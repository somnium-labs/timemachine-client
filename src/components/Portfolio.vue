<template>
    <div>
        <br>
        <H3 style="color: white;">{{title}}</H3>
        <div class="mt-3" v-if="title==='Portfolio'">
            <b-button-group>
                <!-- load -->
                <v-dialog v-model="loadDialog" persistent max-width="600px" dark>
                    <template v-slot:activator="{ on }">
                        <b-button variant="outline-success" v-on="on">Load</b-button>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Load Portfolio</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-select
                                            v-model="portfolioName"
                                            :items="localSettingsNames"
                                            label="Select Portfolio"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="cancelLoad">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="loadPortfolio">Load</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- save -->
                <v-dialog v-model="saveDialog" persistent max-width="600px" dark>
                    <template v-slot:activator="{ on }">
                        <b-button variant="outline-primary" v-on="on">Save As</b-button>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Save Portfolio</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="portfolioName"
                                            label="Portfolio Name*"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="cancelSave">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="savePortfolio">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <b-button
                    variant="outline-danger"
                    @click="savePortfolio"
                    :disabled="saveDisabled"
                >Save</b-button>
            </b-button-group>
            <br>
        </div>
        <b-alert
            :show="dismissCountDown"
            dismissible
            variant="warning"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
        >At least two portfolios must be constructed! (It closes in {{ dismissCountDown }} seconds ...)</b-alert>
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
                <e-column field="date" headerText="Date" textAlign="left" :allowEditing="false"></e-column>
                <e-column
                    field="price"
                    headerText="Price"
                    textAlign="left"
                    :allowEditing="false"
                    format="N2"
                ></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios, { AxiosPromise, AxiosInstance } from 'axios';
import { TS } from 'typescript-linq';
import { ISubject, IAssetInfo, IBenchmark, IRecord } from '../model/SharedModel';
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
    },
    props: {
        title: String
    }
})
export default class Portfolio extends Vue {
    private data: IRecord[] = [];
    private dismissSecs: number = 5;
    private dismissCountDown: number = 0;

    // key: asset code
    private portfolio: TS.Collections.Dictionary<
        string,
        IRecord
    > = new TS.Collections.Dictionary<string, IRecord>();
    private selectionOptions = { type: 'Multiple' };
    private contextMenuItems = [
        { text: 'Remove Portfolio', id: 'removePortfolio' }
    ];
    private settings = {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true
    };

    private saveDialog: boolean = false;
    private loadDialog: boolean = false;

    private portfolioName: string = '';

    private localSettings: any;
    private localSettingsNames: string[] = [];

    private saveDisabled: boolean = true;

    public constructor() {
        super();

        this.localSettings = JSON.parse(localStorage.getItem(
            'portfolio'
        ) as string);

        if (this.localSettings === null) {
            this.localSettings = {
                portfolio: []
            };
        } else {
            this.localSettings.portfolio.forEach((element: any) => {
                this.localSettingsNames.push(element.name as string);
            });
        }
    }

    public async addPortfolio(universe: ISubject[]) {
        const assetInfo: IAssetInfo[] = [];
        universe.forEach((x: ISubject) => {
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
            const record: IRecord = {
                assetCode: x.assetCode,
                assetName: x.assetName,
                exchange: x.exchange,
                volume: newVolume,
                ratio: newRatio,
                date: x.date,
                price: newPrice
            };
            this.addRecord(record);
        });
    }

    public getBenchmark() {
        return this.portfolio.first().value;
    }

    public async analyzePortfolio(benchmark: IBenchmark) {
        const assetInfo: IBenchmark[] = [];
        this.portfolio.forEach((x: TS.Collections.KeyValuePair<string, IRecord>) => {
            const asset: IBenchmark = {
                assetCode: x.value.assetCode,
                volume: x.value.volume,
                ratio: x.value.ratio,
            };
            assetInfo.push(asset);
        });

        const result = await axios({
            url: `${this.$store.state.url}/api/values/AnalyzePortfolio`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                country: this.$store.state.option.country,
                portfolio: assetInfo,
                startDate: this.$store.state.option.startDate,
                endDate: this.$store.state.option.endDate,
                capital: this.$store.state.option.capital,
                benchmark: {
                    assetCode: benchmark.assetCode, // this.$store.state.option.benchmark,
                    volume: benchmark.volume,
                    ratio: benchmark.ratio
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

    public async onChangeStartDate(date: string) {
        const assetInfo: IAssetInfo[] = [];
        this.portfolio.forEach((x: TS.Collections.KeyValuePair<string, IRecord>) => {
            const asset = {
                assetCode: x.value.assetCode,
                exchange: x.value.exchange
            };
            assetInfo.push(asset);
        });

        const response = await axios({
            url: `${this.$store.state.url}/api/values/OpenPrice`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                assets: assetInfo,
                startDate: date
            }
        });

        const data = response.data.data;
        data.forEach((x: any) => {
            const value = this.portfolio.getValue(x.assetCode);
            if (value !== undefined) {
                value.date = x.date;
                value.price = x.openPrice;
            }
        });

        this.refreshPortfolio();
    }

    public refreshPortfolio() {
        const temp: IRecord[] = [];
        this.portfolio.forEach((x: TS.Collections.KeyValuePair<string, IRecord>) => {
            x.value.ratio = 1 / this.portfolio.count();
            x.value.volume =
                (this.$store.state.option.capital * x.value.ratio) /
                x.value.price;
            temp.push(x.value);
        });
        this.data = temp;
    }

    private countDownChanged(dismissCountDown: number) {
        this.dismissCountDown = dismissCountDown;
    }

    private addRecord(record: IRecord) {
        this.portfolio.add(record.assetCode, {
            assetCode: record.assetCode,
            assetName: record.assetName,
            exchange: record.exchange,
            volume: record.volume,
            ratio: record.ratio,
            date: record.date,
            price: record.price
        });

        this.refreshPortfolio();
    }

    private removeRecord() {
        const gridComponent = this.$refs.portfolioComponent as GridComponent;
        const selectedRecords = (gridComponent.getSelectedRecords() as any) as ISubject[];
        if (0 < selectedRecords.length) {
            gridComponent.deleteRecord();
            selectedRecords.forEach((subject: ISubject) => {
                this.portfolio.remove(subject.assetCode);
            });

            this.refreshPortfolio();
        }
    }

    private removeRecordAll() {
        this.data = [];
        this.portfolio.clear();
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

    private cancelLoad() {
        this.loadDialog = false;
    }

    private cancelSave() {
        this.saveDialog = false;
    }

    private savePortfolio() {
        if (this.portfolio.count() < 2) {
            this.dismissCountDown = this.dismissSecs;
            this.saveDialog = false;
            this.saveDisabled = false;
            return;
        }

        const portfolio: IAssetInfo[] = [];

        this.portfolio.forEach((x: TS.Collections.KeyValuePair<string, IRecord>) => {
            portfolio.push({
                assetCode: x.value.assetCode,
                exchange: x.value.exchange
            });
        });

        const idx = this.localSettings.portfolio.findIndex((element: any) => {
            return element.name === this.portfolioName;
        });

        if (idx === -1) {
            this.localSettings.portfolio.push({
                name: this.portfolioName,
                subject: portfolio
            });
            this.localSettingsNames.push(this.portfolioName);
        } else {
            this.localSettings.portfolio[idx].subject = {
                name: this.portfolioName,
                subject: portfolio
            };
        }
        localStorage.setItem('portfolio', JSON.stringify(this.localSettings));
        // chrome.storage.sync.set({
        //     setting: JSON.stringify(this.localSettings)
        // });
        this.saveDialog = false;
        this.saveDisabled = false;
    }

    private loadPortfolio() {
        const idx = this.localSettings.portfolio.findIndex((element: any) => {
            return element.name === this.portfolioName;
        });

        if (idx !== -1) {
            const universe: ISubject[] = [];
            this.localSettings.portfolio[idx].subject.forEach((x: any) => {
                universe.push({
                    rowNumber: 0,
                    firstDate: new Date(),
                    assetCode: x.assetCode,
                    exchange: x.exchange,
                    // interface 제약때문에 dummy
                    assetName: '',
                    sector: '',
                    industry: '',
                    marketCap: 0,
                    evEvitda: 0,
                    divYield: 0,
                    recentVolatility1Year: 0,
                    recentVolatility3Year: 0,
                    recentVolatility5Year: 0,
                    recentVolatility7Year: 0,
                    recentVolatility10Year: 0
                });
            });
            this.removeRecordAll();
            this.addPortfolio(universe);
        }

        this.loadDialog = false;
        this.saveDisabled = false;
    }
}
</script>