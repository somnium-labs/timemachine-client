<template>
    <div>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs content-class="mt-3">
            <b-tab title="Summary" active>
                <ejs-grid :dataSource="summary">
                    <e-columns>
                        <e-column field="subjectType" headerText="Type" textAlign="left"></e-column>
                        <e-column field="strategyType" headerText="strategyType" textAlign="left"></e-column>
                        <e-column
                            field="initialBalance"
                            headerText="initialBalance"
                            textAlign="left"
                        ></e-column>
                        <e-column field="endBalance" headerText="endBalance" textAlign="left"></e-column>
                        <e-column field="commission" headerText="commission" textAlign="left"></e-column>
                        <e-column
                            field="periodReturnRatio"
                            headerText="periodReturnRatio"
                            textAlign="left"
                        ></e-column>
                        <e-column
                            field="annualizeReturnRatio"
                            headerText="annualizeReturnRatio"
                            textAlign="left"
                        ></e-column>
                        <e-column
                            field="volatilityRatio"
                            headerText="volatilityRatio"
                            textAlign="left"
                        ></e-column>
                        <e-column field="mddRatio" headerText="mddRatio" textAlign="left"></e-column>
                        <e-column field="sharpeRatio" headerText="sharpeRatio" textAlign="left"></e-column>
                    </e-columns>
                </ejs-grid>
            </b-tab>
        </b-tabs>
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
import { TabPlugin, TabComponent } from '@syncfusion/ej2-vue-navigations';

Vue.use(TabPlugin);
Vue.use(GridPlugin);

@Component({
    props: {
        startDate: String,
        endDate: String
    }
})
export default class Report extends Vue {
    private data: any[] = [];
    private summary: any[] = [];

    public CreateReport(data: any) {
        const temp: any[] = [];
        for (const k in data.data) {
            const v = data.data[k];
            temp.push(v.summary);
        }
        this.summary = temp;
    }
}
</script>