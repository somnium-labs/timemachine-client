<template>
    <div>
        <ejs-grid
            ref="record"
            :dataSource="records"
            :allowPaging="true"
            :pageSettings="pageSettings"
            :allowFiltering="true"
            :filterSettings="filterOptions"
            :allowSorting="true"
        >
            <e-columns>
                <e-column
                    field="date"
                    headerText="Date"
                    textAlign="left"
                    :format="formatOptions"
                    type="date"
                ></e-column>
                <e-column
                    field="totalBalance"
                    headerText="Total Balance"
                    textAlign="left"
                    format="¥#,##"
                ></e-column>
                <e-column field="balance" headerText="Balance" textAlign="left" format="¥#,##.#"></e-column>
                <e-column
                    field="ratingBalance"
                    headerText="Rating Balance"
                    textAlign="left"
                    format="¥#,##"
                ></e-column>
                <e-column field="return" headerText="Returns" textAlign="left" format="¥#,##"></e-column>
                <e-column
                    field="cumulativeReturn"
                    headerText="Cumulative Return"
                    textAlign="left"
                    format="¥#,##"
                ></e-column>
                <e-column field="returnRatio" headerText="Returns(%)" textAlign="left" format="P2"></e-column>
                <e-column
                    field="cumulativeReturnRatio"
                    headerText="Cumulative Returns(%)"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column
                    field="volatilityRatio"
                    headerText="Volatility"
                    textAlign="left"
                    format="P2"
                ></e-column>
                <e-column field="mdd" headerText="MDD" textAlign="left" format="P2"></e-column>
                <e-column field="max" headerText="Max" textAlign="left" format="¥#,##"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import {
    GridPlugin,
    GridComponent,
    Page,
    Filter,
    Sort
} from '@syncfusion/ej2-vue-grids';
import moment from 'moment';

Vue.use(GridPlugin);

@Component({
    provide: {
        grid: [Page, Filter, Sort]
    }
})
export default class Record extends Vue {
    private records: any[] = [];
    private pageSettings = { pageSize: 20 };
    private formatOptions = { type: 'date', format: 'yyyy-MM-dd' };
    private filterOptions = { type: 'Menu' };
    private filter = { type: 'CheckBox' };

    public createRecords(records: any[]) {
        records.forEach((x: any) => {
            x.date = moment(x.date as Date);
        });
        this.records = records;
    }
}
</script>