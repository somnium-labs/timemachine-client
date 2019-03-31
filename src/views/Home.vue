<template>
    <v-container fluid class="home">
        <ejs-sidebar id="option-sidebar" ref="sidebar" :target="target" width="300">
            <Option/>
        </ejs-sidebar>
        <v-layout row wrap>
            <v-flex xs12>
                <Universe msg="Welcome to Your Vue.js + TypeScript App"/>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs6>
                <Portfolio/>
            </v-flex>
        </v-layout>
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
}
</script>