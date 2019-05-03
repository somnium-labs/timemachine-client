<template>
    <v-container style="background-color: #212121;" py-0 pl-4>
        <v-layout row wrap>
            <v-flex xs10>
                <div class="mt-3">
                    <b-button-group>
                        <!-- load -->
                        <v-dialog v-model="loadDialog" persistent max-width="600px" dark>
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
                        <v-dialog v-model="saveDialog" persistent max-width="600px" dark>
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
                            @click="saveOption"
                            :disabled="saveDisabled"
                        >Save</b-button>
                    </b-button-group>
                </div>
            </v-flex>
            <v-flex xs2></v-flex>
        </v-layout>
        <br>
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Start Date</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-datepicker
                    id="startDate"
                    ref="startDate"
                    :value="startDate"
                    :format="dateFormat"
                    :change="change"
                ></ejs-datepicker>
            </v-flex>
        </v-layout>
        <!-- 종료날짜 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">End Date</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-datepicker
                    id="endDate"
                    ref="endDate"
                    :value="endDate"
                    :format="dateFormat"
                    :change="change"
                ></ejs-datepicker>
            </v-flex>
        </v-layout>
        <!-- 자산 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Capital</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-numerictextbox
                    :value="capital"
                    :step="capitalStep"
                    format="¥#,##"
                    :change="capitalChange"
                ></ejs-numerictextbox>
            </v-flex>
        </v-layout>
        <!-- 수수료 타입 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Commission</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-combobox
                    ref="commissionType"
                    id="commissionType"
                    showClearButton="false"
                    :dataSource="comboboxSource"
                    :change="change"
                ></ejs-combobox>
            </v-flex>
        </v-layout>
        <!-- 수수료 -->
        <v-layout row wrap>
            <v-flex xs6>
                <!-- empty -->
            </v-flex>
            <v-flex xs4>
                <ejs-numerictextbox
                    ref="commission"
                    id="commission"
                    :value="commission"
                    :step="commissionStep"
                    :format="commissionFormat"
                    :change="commissionChange"
                ></ejs-numerictextbox>
            </v-flex>
        </v-layout>
        <!-- 슬리피지 타입 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Slippage</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-combobox
                    ref="slippage"
                    id="slippageType"
                    showClearButton="false"
                    :dataSource="comboboxSource"
                    :change="change"
                ></ejs-combobox>
            </v-flex>
        </v-layout>
        <!-- 슬리피지 -->
        <v-layout row wrap>
            <v-flex xs6>
                <!-- empty -->
            </v-flex>
            <v-flex xs4>
                <ejs-numerictextbox
                    :value="slippage"
                    :step="slippageStep"
                    :format="slippageFormat"
                    :change="slippageChange"
                ></ejs-numerictextbox>
            </v-flex>
        </v-layout>
        <!-- 주문수량 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Order Volume</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-combobox
                    ref="orderVolume"
                    id="orderVolumeType"
                    showClearButton="false"
                    :dataSource="comboboxSource"
                    :change="change"
                ></ejs-combobox>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs6>
                <!-- empty -->
            </v-flex>
            <v-flex xs4>
                <ejs-checkbox
                    ref="leverage"
                    class="e-checkbox-wrapper"
                    label="Allow decimal point"
                    :change="toggleAllowDecimalPoint"
                ></ejs-checkbox>
            </v-flex>
        </v-layout>
        <!-- 미수금 사용 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Leverage</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-checkbox ref="leverage" class="e-checkbox-wrapper" :change="toggleLeverage"></ejs-checkbox>
            </v-flex>
        </v-layout>
        <!-- 벤치마크 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Benchmark</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-combobox
                    ref="benchmark"
                    id="benchmark"
                    showClearButton="false"
                    :dataSource="benchmarkSource"
                    :change="change"
                ></ejs-combobox>
            </v-flex>
        </v-layout>
        <!-- Buy And Hold -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Buy And Hold</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-checkbox
                    ref="buyAndHold"
                    class="e-checkbox-wrapper"
                    label="Use"
                    :change="toggleBuyAndHold"
                ></ejs-checkbox>
            </v-flex>
        </v-layout>
        <!-- Volatility Breakout -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Volatility Breakout</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-checkbox
                    ref="volatilityBreakout"
                    class="e-checkbox-wrapper"
                    label="Use"
                    :change="toggleVolatilityBreakout"
                ></ejs-checkbox>
            </v-flex>
        </v-layout>
        <!-- Moving Average -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em; color: white;">Moving Average</h6>
            </v-flex>
            <v-flex xs4>
                <ejs-checkbox
                    ref="movingAverage"
                    class="e-checkbox-wrapper"
                    label="Use"
                    :change="toggleMovingAverage"
                ></ejs-checkbox>
            </v-flex>
        </v-layout>
        <div class="center-align">
            <v-btn color="success" @click="analyzePortfolio">Analyze Portfolio</v-btn>
            <v-btn color="warning" @click="analyzeAllPortfolio">Analyze All</v-btn>
        </div>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
    DatePickerPlugin,
    DatePickerComponent
} from '@syncfusion/ej2-vue-calendars';
import { NumericTextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { enableRipple } from '@syncfusion/ej2-base';
import Home from '../views/Home.vue';
import { SharedModel } from '../model/SharedModel';
import {
    CheckBoxPlugin,
    CheckBoxComponent,
    ButtonPlugin
} from '@syncfusion/ej2-vue-buttons';
import {
    ComboBoxPlugin,
    ComboBoxComponent
} from '@syncfusion/ej2-vue-dropdowns';

enableRipple(true);
Vue.use(CheckBoxPlugin);
Vue.use(NumericTextBoxPlugin);
Vue.use(DatePickerPlugin);
Vue.use(ComboBoxPlugin);
Vue.use(ButtonPlugin);

@Component({
    components: {
        Home
    }
})
export default class Option extends Vue {
    private dateFormat: string = 'yyyy-MM-dd';
    private capitalStep: number = 1000;
    private comboboxSource = ['Ratio', 'Fixed'];
    private benchmarkSource = ['JP225'];

    private commissionStep: number = 0.0001;
    private commissionFormat: string = 'P2';

    private slippageStep: number = 0.0001;
    private slippageFormat: string = 'P2';

    private saveDialog: boolean = false;
    private loadDialog: boolean = false;

    private settingName: string = '';

    private localSettings: any;
    private localSettingsNames: string[] = [];

    private saveDisabled: boolean = true;

    private defaultOption = {
        startDate: '2010-01-01',
        endDate: '2019-01-01',
        capital: 100000,
        benchmark: 'JP225',
        commissionType: 'Ratio',
        commission: 0.0,
        slippageType: 'Ratio',
        slippage: 0.0,
        tradeType: 'Ratio',
        useOutstandingBalance: true,
        usePointVolume: false,
        useBuyAndHold: true,
        useVolatilityBreakout: true,
        useMovingAverage: false
    };

    public constructor() {
        super();

        this.localSettings = JSON.parse(localStorage.getItem(
            'settings'
        ) as string);
        if (this.localSettings === null) {
            this.localSettings = {
                settings: []
            };
        } else {
            this.localSettings.settings.forEach((element: any) => {
                this.localSettingsNames.push(element.name as string);
            });
        }
    }

    private get startDate() {
        return this.$store.state.option.startDate;
    }

    private set startDate(date: string) {
        this.$store.state.option.startDate = date;
    }

    private get endDate() {
        return this.$store.state.option.endDate;
    }

    private set endDate(date: string) {
        this.$store.state.option.endDate = date;
    }

    private get capital() {
        return this.$store.state.option.capital;
    }

    private set capital(capital: number) {
        this.$store.state.option.capital = capital;
    }

    private get commission() {
        return this.$store.state.option.commission;
    }

    private set commission(commission: number) {
        this.$store.state.option.commission = commission;
    }

    private get commissionType() {
        return this.$store.state.option.commissionType;
    }

    private set commissionType(type: string) {
        this.$store.state.option.commissionType = type;
    }

    private get slippage() {
        return this.$store.state.option.slippage;
    }

    private set slippage(slippage: number) {
        this.$store.state.option.slippage = slippage;
    }

    private get slippageType() {
        return this.$store.state.option.slippageType;
    }

    private set slippageType(slippageType: string) {
        this.$store.state.option.slippageType = slippageType;
    }

    private get benchmark() {
        return this.$store.state.option.benchmark;
    }

    private set benchmark(assetCode: string) {
        this.$store.state.option.benchmark = assetCode;
    }

    private get tradeType() {
        return this.$store.state.option.tradeType;
    }

    private set tradeType(tradeType: string) {
        this.$store.state.option.tradeType = tradeType;
    }

    private get useOutstandingBalance() {
        return this.$store.state.option.useOutstandingBalance;
    }

    private set useOutstandingBalance(use: boolean) {
        this.$store.state.option.useOutstandingBalance = use;
    }

    private get usePointVolume() {
        return this.$store.state.option.usePointVolume;
    }

    private set usePointVolume(use: boolean) {
        this.$store.state.option.usePointVolume = use;
    }

    private get useBuyAndHold() {
        return this.$store.state.option.useBuyAndHold;
    }

    private set useBuyAndHold(use: boolean) {
        this.$store.state.option.useBuyAndHold = use;
    }

    private get useVolatilityBreakout() {
        return this.$store.state.option.useVolatilityBreakout;
    }

    private set useVolatilityBreakout(use: boolean) {
        this.$store.state.option.useVolatilityBreakout = use;
    }

    private get useMovingAverage() {
        return this.$store.state.option.useMovingAverage;
    }

    private set useMovingAverage(use: boolean) {
        this.$store.state.option.useMovingAverage = use;
    }

    private created() {
        this.updateOptionData(this.defaultOption);
    }

    private mounted() {
        this.updateOptionUI(this.defaultOption);
    }

    private change(args: any) {
        if (args.element.id === 'commissionType') {
            this.commissionType =
                args.itemData != null ? args.itemData.value : '';
            if (this.commissionType === 'Ratio') {
                this.commissionFormat = 'P2';
                this.commissionStep = 0.0001;
                this.commission = 0.0;
            } else {
                this.commissionFormat = '¥###.##';
                this.commissionStep = 1;
                this.commission = 1;
            }
        } else if (args.element.id === 'slippageType') {
            this.slippageType =
                args.itemData != null ? args.itemData.value : '';
            if (this.slippageType === 'Ratio') {
                this.slippageFormat = 'P2';
                this.slippageStep = 0.0001;
                this.slippage = 0.0;
            } else {
                this.slippageFormat = '¥###.##';
                this.slippageStep = 1;
                this.slippage = 1;
            }
        } else if (args.element.id === 'orderVolumeType') {
            this.tradeType = args.itemData != null ? args.itemData.value : '';
        } else if (args.element.id === 'benchmark') {
            this.benchmark = args.itemData != null ? args.itemData.value : '';
            const homeComponent = this.$parent as Home;
            homeComponent.setBenchmark(this.benchmark);
        } else if (args.element.id === 'startDate') {
            if (args.element.value !== this.startDate) {
                this.startDate = args.element.value;
                const homeComponent = this.$parent as Home;
                homeComponent.onChangeStartDate(this.startDate);
            }
        } else if (args.element.id === 'endDate') {
            this.endDate = args.element.value;
        }
    }

    private toggleLeverage(args: any) {
        this.useOutstandingBalance = args.checked;
    }

    private toggleAllowDecimalPoint(args: any) {
        this.usePointVolume = args.checked;
    }

    private toggleBuyAndHold(args: any) {
        this.useBuyAndHold = args.checked;
    }

    private toggleVolatilityBreakout(args: any) {
        this.useVolatilityBreakout = args.checked;
    }

    private toggleMovingAverage(args: any) {
        this.useMovingAverage = args.checked;
    }

    private analyzePortfolio() {
        const homeComponent = this.$parent as Home;
        homeComponent.analyzePortfolio();
    }

    private analyzeAllPortfolio() {
        const homeComponent = this.$parent as Home;
        homeComponent.analyzeAllPortfolio();
    }

    private commissionChange(args: any) {
        this.commission = args.value;
    }

    private capitalChange(args: any) {
        this.capital = args.value;

        const homeComponent = this.$parent as Home;
        homeComponent.refreshPortfolio();
    }

    private slippageChange(args: any) {
        this.slippage = args.value;
    }

    private saveOption() {
        const setting = {
            name: this.settingName,
            setting: {
                startDate: this.startDate,
                endDate: this.endDate,
                capital: this.capital,
                benchmark: this.benchmark,
                commissionType: this.commissionType,
                commission: this.commission,
                slippageType: this.slippageType,
                slippage: this.slippage,
                tradeType: this.tradeType,
                useOutstandingBalance: this.useOutstandingBalance,
                usePointVolume: this.usePointVolume,
                useBuyAndHold: this.useBuyAndHold,
                useVolatilityBreakout: this.useVolatilityBreakout,
                useMovingAverage: this.useMovingAverage
            }
        };

        const idx = this.localSettings.settings.findIndex((element: any) => {
            return element.name === this.settingName;
        });

        if (idx === -1) {
            this.localSettings.settings.push(setting);
            this.localSettingsNames.push(this.settingName);
        } else {
            this.localSettings.settings[idx].setting = setting.setting;
        }

        localStorage.setItem('settings', JSON.stringify(this.localSettings));
        // chrome.storage.sync.set({
        //     setting: JSON.stringify(this.localSettings)
        // });
        this.saveDialog = false;
        this.saveDisabled = false;
    }

    private cancelLoad() {
        this.loadDialog = false;
    }

    private cancelSave() {
        this.saveDialog = false;
    }

    private loadOption() {
        const idx = this.localSettings.settings.findIndex((element: any) => {
            return element.name === this.settingName;
        });

        if (idx !== -1) {
            this.updateOptionUI(this.localSettings.settings[idx].setting);
            this.updateOptionData(this.localSettings.settings[idx].setting);
        }

        this.loadDialog = false;
        this.saveDisabled = false;
    }

    // private saveOption() {
    //     this.updateOptionUI(this.defaultOption);
    //     this.updateOptionData(this.defaultOption);
    // }

    private updateOptionData(option: SharedModel.TradeOption) {
        this.$store.state.option = {
            startDate: option.startDate,
            endDate: option.endDate,
            capital: option.capital,
            benchmark: option.benchmark,
            commissionType: option.commissionType,
            commission: option.commission,
            slippageType: option.slippageType,
            slippage: option.slippage,
            tradeType: option.tradeType,
            useOutstandingBalance: option.useOutstandingBalance,
            usePointVolume: option.usePointVolume,
            useBuyAndHold: option.useBuyAndHold,
            useVolatilityBreakout: option.useVolatilityBreakout,
            useMovingAverage: option.useMovingAverage
        };
    }

    private updateOptionUI(option: SharedModel.TradeOption) {
        const startDateComponent = this.$refs.startDate as DatePickerComponent;
        startDateComponent.ej2Instances.value = option.startDate;

        const endDateComponent = this.$refs.endDate as DatePickerComponent;
        endDateComponent.ej2Instances.value = option.endDate;

        const commissionComboBox = this.$refs
            .commissionType as ComboBoxComponent;
        commissionComboBox.ej2Instances.value = option.commissionType;

        const slippageComboBox = this.$refs.slippage as ComboBoxComponent;
        slippageComboBox.ej2Instances.value = option.slippageType;

        const orderVolumeComboBox = this.$refs.orderVolume as ComboBoxComponent;
        orderVolumeComboBox.ej2Instances.value = option.tradeType;

        const leverageCheckBox = this.$refs.leverage as CheckBoxComponent;
        leverageCheckBox.ej2Instances.checked = option.useOutstandingBalance;

        const benchmarkComboBox = this.$refs.benchmark as ComboBoxComponent;
        benchmarkComboBox.ej2Instances.value = option.benchmark;

        const buyAndHoldCheckBox = this.$refs.buyAndHold as CheckBoxComponent;
        buyAndHoldCheckBox.ej2Instances.checked = option.useBuyAndHold;

        const volatilityBreakoutCheckBox = this.$refs
            .volatilityBreakout as CheckBoxComponent;
        volatilityBreakoutCheckBox.ej2Instances.checked =
            option.useVolatilityBreakout;

        const movingAverageCheckBox = this.$refs
            .movingAverage as CheckBoxComponent;
        movingAverageCheckBox.ej2Instances.checked = option.useMovingAverage;
    }
}
</script>

<style>
.e-checkbox-wrapper {
    margin-top: 7px;
}

.center-align {
    text-align: center;
    padding: 20px;
}
</style>