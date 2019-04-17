<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Start Date</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-datepicker id="startDate" :value="startDate" :format="dateFormat" :change=change></ejs-datepicker>
            </v-flex>
        </v-layout>
        <!-- 종료날짜 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">End Date</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-datepicker id="endDate" :value="endDate" :format="dateFormat" :change=change></ejs-datepicker>
            </v-flex>
        </v-layout>
        <!-- 자산 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Capital</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-numerictextbox :value="capital" :step="capitalStep" format="¥#,##" :change="capitalChange"></ejs-numerictextbox>
            </v-flex>
        </v-layout>
        <!-- 수수료 타입 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Commission</h6>
            </v-flex>
            <v-flex xs6>
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
            <v-flex xs6>
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
                <h6 style="margin-top: 0.28em">Slippage</h6>
            </v-flex>
            <v-flex xs6>
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
            <v-flex xs6>
                <ejs-numerictextbox :value="slippage" :step="slippageStep" :format="slippageFormat" :change="slippageChange"></ejs-numerictextbox>
            </v-flex>
        </v-layout>
        <!-- 주문수량 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Order Volume</h6>
            </v-flex>
            <v-flex xs6>
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
            <v-flex xs6>
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
                <h6 style="margin-top: 0.28em">Leverage</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-checkbox ref="leverage" class="e-checkbox-wrapper" :change="toggleLeverage"></ejs-checkbox>
            </v-flex>
        </v-layout>
        <!-- 벤치마크 -->
        <v-layout row wrap>
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Benchmark</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-combobox
                    ref="benchmark"
                    id="benchmark"
                    showClearButton="false"
                    :dataSource="benchmarkSource"
                    :change="change"
                ></ejs-combobox>
            </v-flex>
            <!-- Buy And Hold -->
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Buy And Hold</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-checkbox
                    ref="buyAndHold"
                    class="e-checkbox-wrapper"
                    label="Use"
                    :change="toggleBuyAndHold"
                ></ejs-checkbox>
            </v-flex>
            <!-- Volatility Breakout -->
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Volatility Breakout</h6>
            </v-flex>
            <v-flex xs6>
                <ejs-checkbox
                    ref="volatilityBreakout"
                    class="e-checkbox-wrapper"
                    label="Use"
                    :change="toggleVolatilityBreakout"
                ></ejs-checkbox>
            </v-flex>
            <!-- Moving Average -->
            <v-flex xs6>
                <h6 style="margin-top: 0.28em">Moving Average</h6>
            </v-flex>
            <v-flex xs6>
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
        </div>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SharedModel } from '../model/SharedModel';
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars';
import { NumericTextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { enableRipple } from '@syncfusion/ej2-base';
import Home from '../views/Home.vue';
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

    private get slippage() {
        return this.$store.state.option.slippage;
    }

    private set slippage(slippage: number) {
        this.$store.state.option.slippage = slippage;
    }

    private created() {
        this.$store.state.option = {
            startDate: '2010-01-01',
            endDate: '2019-01-01',
            capital: 100000,
            benchmark: '',
            commissionType: '',
            commission: 0.0003,
            slippageType: '',
            slippage: 0.0001,
            tradeType: '',
            useOutstandingBalance: true,
            usePointVolume: false,
            useBuyAndHold: true,
            useVolatilityBreakout: true,
            useMovingAverage: false
        };
    }

    private mounted() {
        const commissionComboBox = this.$refs
            .commissionType as ComboBoxComponent;
        if (commissionComboBox != null) {
            commissionComboBox.ej2Instances.value = 'Ratio';
        }

        const slippageComboBox = this.$refs.slippage as ComboBoxComponent;
        if (slippageComboBox != null) {
            slippageComboBox.ej2Instances.value = 'Ratio';
        }

        const orderVolumeComboBox = this.$refs.orderVolume as ComboBoxComponent;
        if (orderVolumeComboBox != null) {
            orderVolumeComboBox.ej2Instances.value = 'Ratio';
        }

        const leverageCheckBox = this.$refs.leverage as CheckBoxComponent;
        if (leverageCheckBox != null) {
            leverageCheckBox.ej2Instances.checked = true;
        }

        const benchmarkComboBox = this.$refs.benchmark as ComboBoxComponent;
        if (benchmarkComboBox != null) {
            benchmarkComboBox.ej2Instances.value = 'JP225';
        }

        const buyAndHoldCheckBox = this.$refs.buyAndHold as CheckBoxComponent;
        if (buyAndHoldCheckBox != null) {
            buyAndHoldCheckBox.ej2Instances.checked = true;
        }

        const volatilityBreakoutCheckBox = this.$refs
            .volatilityBreakout as CheckBoxComponent;
        if (volatilityBreakoutCheckBox != null) {
            volatilityBreakoutCheckBox.ej2Instances.checked = true;
        }

        const movingAverageCheckBox = this.$refs
            .movingAverage as CheckBoxComponent;
        if (movingAverageCheckBox != null) {
            movingAverageCheckBox.ej2Instances.checked = false;
        }
    }

    private change(args: any) {
        if (args.element.id === 'commissionType') {
            this.$store.state.option.commissionType =
                args.itemData != null ? args.itemData.value : '';
            if (this.$store.state.option.commissionType === 'Ratio') {
                this.commissionFormat = 'P2';
                this.commissionStep = 0.0001;
                this.$store.state.option.commission = 0.0003;
            } else {
                this.commissionFormat = '¥###.##';
                this.commissionStep = 1;
                this.$store.state.option.commission = 1;
            }
        } else if (args.element.id === 'slippageType') {
            this.$store.state.option.slippageType =
                args.itemData != null ? args.itemData.value : '';
            if (this.$store.state.option.slippageType === 'Ratio') {
                this.slippageFormat = 'P2';
                this.slippageStep = 0.0001;
                this.$store.state.option.slippage = 0.0001;
            } else {
                this.slippageFormat = '¥###.##';
                this.slippageStep = 1;
                this.$store.state.option.slippage = 1;
            }
        } else if (args.element.id === 'orderVolumeType') {
            this.$store.state.option.tradeType =
                args.itemData != null ? args.itemData.value : '';
        } else if (args.element.id === 'benchmark') {
            this.$store.state.option.benchmark =
                args.itemData != null ? args.itemData.value : '';
        } else if (args.element.id === 'startDate') {
            this.startDate = args.element.value;
        } else if (args.element.id === 'endDate') {
            this.endDate = args.element.value;
        }
    }

    private toggleLeverage(args: any) {
        this.$store.state.option.useOutstandingBalance = args.checked;
    }

    private toggleAllowDecimalPoint(args: any) {
        this.$store.state.option.usePointVolume = args.checked;
    }

    private toggleBuyAndHold(args: any) {
        this.$store.state.option.useBuyAndHold = args.checked;
    }

    private toggleVolatilityBreakout(args: any) {
        this.$store.state.option.useVolatilityBreakout = args.checked;
    }

    private toggleMovingAverage(args: any) {
        this.$store.state.option.useMovingAverage = args.checked;
    }

    private analyzePortfolio() {
        const homeComponent = this.$parent.$parent as Home;
        homeComponent.analyzePortfolio();
    }

    private commissionChange(args: any) {
        this.commission = args.value;
    }

    private capitalChange(args: any) {
        this.capital = args.value;

        const homeComponent = this.$parent.$parent as Home;
        homeComponent.refreshPortfolio();
    }

    private slippageChange(args: any) {
        this.slippage = args.value;
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