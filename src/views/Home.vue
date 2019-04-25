<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs2>
                <Option/>
            </v-flex>
            <v-flex xs10>
                <v-layout row wrap>
                    <v-flex>
                        <Universe class="universe"/>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs6>
                        <Portfolio ref="portfolio" title="Portfolio"/>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs6>
                        <Portfolio ref="benchmark" title="Benchmark"/>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <Report startDate endDate ref="report"/>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-snackbar
            v-model="snackbar"
            :bottom="y === 'bottom'"
            :left="x === 'left'"
            :multi-line="mode === 'multi-line'"
            :right="x === 'right'"
            :timeout="timeout"
            :top="y === 'top'"
            :vertical="mode === 'vertical'"
        >
            {{ text }}
            <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>

        <v-dialog v-model="dialog" hide-overlay persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Analyzing...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Universe from '@/components/Universe.vue'; // @ is an alias to /src
import Portfolio from '@/components/Portfolio.vue';
import Option from '@/components/Option.vue';
import Report from '@/components/Report.vue';
import {
    SidebarPlugin,
    SidebarComponent
} from '@syncfusion/ej2-vue-navigations';
import { SharedModel } from '../model/SharedModel';
import { TabPlugin, TabComponent } from '@syncfusion/ej2-vue-navigations';
import { enableRipple, createElement } from '@syncfusion/ej2-base';

Vue.use(TabPlugin);
Vue.use(SidebarPlugin);

@Component({
    components: {
        Universe,
        Portfolio,
        Option,
        Report
    }
})
export default class Home extends Vue {
    private target: string = '.home';
    private isShow: boolean = true;
    private snackbar: boolean = false;
    private dialog: boolean = false;

    public constructor() {
        super();

        if (process.env.NODE_ENV === 'development') {
            console.log('development');
            this.$store.state.url = 'https://localhost:5001';
        } else {
            console.log('production');
            this.$store.state.url = 'http://10.78.202.110:5000';
        }
    }

    public data() {
        return {
            x: null,
            y: 'top',
            mode: '',
            timeout: 5000,
            text: 'Portfolio analysis is complete.'
        };
    }

    public toggleSidebar() {
        const sidebarComponent = this.$refs.sidebar as SidebarComponent;

        if (this.isShow) {
            this.isShow = false;
            sidebarComponent.hide();
        } else {
            this.isShow = true;
            sidebarComponent.show();
        }
    }

    public addPortfolio(universe: SharedModel.Subject[]) {
        const portfolioComponent = this.$refs.portfolio as Portfolio;
        portfolioComponent.addPortfolio(universe);
    }

    public setBenchmark(benchmark: string) {
        const universe: SharedModel.Subject[] = [];
        universe.push({
            assetCode: benchmark,
            exchange: 'INDEX',
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

        const portfolioComponent = this.$refs.benchmark as Portfolio;
        portfolioComponent.addPortfolio(universe);
    }

    public async analyzePortfolio() {
        this.dialog = true;

        const portfolioComponent = this.$refs.portfolio as Portfolio;
        const benchmarkComponent = this.$refs.benchmark as Portfolio;
        const benchmark = benchmarkComponent.getBenchmark();
        const response = await portfolioComponent.analyzePortfolio(benchmark);

        const reportComponent = this.$refs.report as Report;
        reportComponent.CreateReport(response);

        this.snackbar = true;
        this.dialog = false;
    }

    public async refreshPortfolio() {
        const portfolioComponent = this.$refs.portfolio as Portfolio;
        portfolioComponent.refreshPortfolio();

        const benchmarkComponent = this.$refs.benchmark as Portfolio;
        benchmarkComponent.refreshPortfolio();
    }

    public async onChangeStartDate(date: string) {
        const portfolioComponent = this.$refs.portfolio as Portfolio;
        portfolioComponent.onChangeStartDate(date);

        const benchmarkComponent = this.$refs.benchmark as Portfolio;
        benchmarkComponent.onChangeStartDate(date);
    }
}
</script>