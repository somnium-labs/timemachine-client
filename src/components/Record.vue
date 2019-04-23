<template>
    <div>
        <ejs-grid
            ref="record"
            :dataSource="records"
            :allowPaging="true"
            :pageSettings="pageSettings"
        >
            <e-columns>
                <e-column field="date" headerText="Date" textAlign="left"></e-column>
                <e-column
                    field="totalBalance"
                    headerText="Total Balance"
                    textAlign="left"
                    format="#,##"
                ></e-column>
                <e-column field="balance" headerText="Balance" textAlign="left" format="#,##"></e-column>
                <e-column
                    field="ratingBalance"
                    headerText="Rating Balance"
                    textAlign="left"
                    format="#,##"
                ></e-column>
                <e-column field="return" headerText="Returns" textAlign="left" format="#,##"></e-column>
                <e-column
                    field="cumulativeReturn"
                    headerText="Cumulative Return"
                    textAlign="left"
                    format="#,##"
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
                    format="#,##.#"
                ></e-column>
                <e-column field="mdd" headerText="MDD" textAlign="left" format="#,##.#"></e-column>
                <e-column field="max" headerText="Max" textAlign="left" format="#,##"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import { GridPlugin, GridComponent, Page } from '@syncfusion/ej2-vue-grids';

Vue.use(GridPlugin);

@Component({
    provide: {
        grid: [Page]
    }
})
export default class Record extends Vue {
    private records: any[] = [];
    private pageSettings = { pageSize: 20 };

    public createRecords(records: any[]) {
        this.records = records;
    }
}
</script>