<template>
    <v-container fluid class="home">
        <v-container fluid>
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
            <ejs-sidebar id="option-sidebar" ref="sidebar" type="Auto" width="300" :target="target">
                <Option/>
            </ejs-sidebar>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Universe from '@/components/Universe.vue'; // @ is an alias to /src
import Portfolio from '@/components/Portfolio.vue';
import Option from '@/components/Option.vue';
import {
    SidebarPlugin,
    SidebarComponent
} from '@syncfusion/ej2-vue-navigations';
import { SharedModel } from '../model/SharedModel';

Vue.use(SidebarPlugin);

@Component({
    components: {
        Universe,
        Portfolio,
        Option
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

    public analyzePortfolio() {
        const portfolioComponent = this.$refs.portfolio as Portfolio;
        portfolioComponent.analyzePortfolio();
    }
}
</script>