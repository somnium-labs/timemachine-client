<template>
    <v-container fluid class="home">
        <v-container fluid>
            <ejs-sidebar id="option-sidebar" ref="sidebar" type="Auto" width="300" :target="target">
                <Option/>
            </ejs-sidebar>
            <v-layout row wrap>
                <v-flex xs12>
                    <Universe class="universe"/>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs6>
                    <Portfolio ref="portfolio"/>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs8>
                    <Report startDate endDate ref="report"/>
                </v-flex>
            </v-layout>
        </v-container>
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

    public async analyzePortfolio() {
        const portfolioComponent = this.$refs.portfolio as Portfolio;
        const response = await portfolioComponent.analyzePortfolio();

        const reportComponent = this.$refs.report as Report;
        console.log(response);
        reportComponent.CreateReport(response);
    }
}
</script>