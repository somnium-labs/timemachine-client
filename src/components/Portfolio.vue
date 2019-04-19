<template>
    <div>
        <br>
        <H3>{{title}}</H3>
        <div class="mt-3">
            <b-button-group>
                <!-- load -->
                <v-dialog v-model="loadDialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <b-button variant="outline-success" v-on="on">Load</b-button>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Load Setting</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-select
                                            v-model="settingName"
                                            :items="localSettingsNames"
                                            label="Select Setting"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="cancelLoad">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="loadOption">Load</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- save -->
                <v-dialog v-model="saveDialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <b-button variant="outline-primary" v-on="on">Save As</b-button>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Save Setting</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="settingName"
                                            label="Setting Name*"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="cancelSave">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="saveOption">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <b-button
                    variant="outline-danger"
                    @click="resetOption"
                    :disabled="saveDisabled"
                >Save</b-button>
            </b-button-group>
        </div>
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
    },
    props: {
        title: String
    }
})
export default class Portfolio extends Vue {
    private data: any[] = [];

    // key: asset code
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

    private saveDialog: boolean = false;
    private loadDialog: boolean = false;

    private settingName: string = '';

    private localSettings: any;
    private localSettingsNames: string[] = [];

    private saveDisabled: boolean = true;

    public constructor() {
        super();

        this.localSettings = JSON.parse(localStorage.getItem(
            'portfolio'
        ) as string);
        if (this.localSettings === null) {
            this.localSettings = [];
        } else {
            this.localSettings.settings.forEach((element: any) => {
                this.localSettingsNames.push(element.name as string);
            });
        }
    }

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
                exchange: x.exchange,
                volume: newVolume,
                ratio: newRatio,
                price: newPrice
            };
            this.addRecord(record);
        });
    }

    public getBenchmark() {
        return this.portfolio.first().value;
    }

    public async analyzePortfolio(benchmark: any) {
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
        const assetInfo: any[] = [];
        this.portfolio.forEach((x: any) => {
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
            this.portfolio.getValue(x.assetCode).price = x.openPrice;
        });

        this.refreshPortfolio();
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
            exchange: record.exchange,
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

    private cancelLoad() {
        this.loadDialog = false;
    }

    private cancelSave() {
        this.saveDialog = false;
    }
}
</script>