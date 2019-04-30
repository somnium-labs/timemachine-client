<template>
    <div>
        <ejs-grid
            ref="transactionGrid"
            :dataSource="transactions"
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
                <e-column field="assetCode" headerText="Code" textAlign="left" :filter="filter"></e-column>
                <e-column field="assetName" headerText="Name" textAlign="left" :filter="filter"></e-column>
                <e-column field="side" headerText="Side" textAlign="left" :filter="filter"></e-column>
                <e-column field="price" headerText="Price" textAlign="left" format="¥#,##.#"></e-column>
                <e-column field="volume" headerText="Volume" textAlign="left" format="N2"></e-column>
                <e-column field="total" headerText="Total" textAlign="left" format="¥#,##.#"></e-column>
                <e-column
                    field="commission"
                    headerText="Commission"
                    textAlign="left"
                    format="¥#,##.#"
                ></e-column>
                <e-column
                    field="creditBalance"
                    headerText="Credit Balance"
                    textAlign="left"
                    format="¥#,##.#"
                ></e-column>
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
export default class Transaction extends Vue {
    private transactions: any[] = [];
    private pageSettings = { pageSize: 20 };
    private formatOptions = { type: 'date', format: 'yyyy-MM-dd' };
    private filterOptions = { type: 'Menu' };
    private filter = { type: 'CheckBox' };

    public createTransactions(transactions: any[]) {
        transactions.forEach((x: any) => {
            x.date = moment(x.date as Date);
        });
        this.transactions = transactions;
    }
}
</script>