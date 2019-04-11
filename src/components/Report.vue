<template>
    <div>
        <H3>Portfolio Analysis Results {{startDate}} {{endDate}}</H3>
        <b-tabs content-class="mt-3">
            <b-tab title="Summary" active>
                <ejs-grid :dataSource="summary">
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