<template>
    <ejs-grid
        ref="grid"
        id="universeGrid"
        :dataSource="data"
        :selectionSettings="selectionOptions"
        :allowFiltering="true"
        :filterSettings="filterOptions"
        :allowResizing="false"
        :allowPaging="true"
        :pageSettings="pageSettings"
        :allowSorting="true"
        :toolbar="toolbar"
        :allowExcelExport="true"
        :toolbarClick="toolbarClick"
        :contextMenuItems="contextMenuItems"
        :contextMenuClick="contextMenuClick"
    >
        <e-columns>
            <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
            <e-column
                field="assetName"
                headerText="Name"
                textAlign="left"
                clipMode="EllipsisWithTooltip"
            ></e-column>
            <e-column field="exchange" headerText="Exchange" textAlign="left" :filter="filter"></e-column>
            <e-column
                field="sector"
                headerText="Sector"
                textAlign="left"
                clipMode="EllipsisWithTooltip"
                :filter="filter"
            ></e-column>
            <e-column
                field="industry"
                headerText="Industry"
                textAlign="left"
                clipMode="EllipsisWithTooltip"
                :filter="filter"
            ></e-column>
            <e-column
                field="marketCap"
                headerText="Market Cap"
                textAlign="left"
                format="N0"
                width="180"
            ></e-column>
            <e-column field="per" headerText="PER" textAlign="center"></e-column>
            <e-column field="pbr" headerText="PBR" textAlign="center"></e-column>
            <e-column field="evEvitda" headerText="EV/EVITDA" textAlign="center"></e-column>
            <e-column field="divYield" headerText="Div Yield" textAlign="center"></e-column>
        </e-columns>
    </ejs-grid>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import axios from 'axios';
import { SharedModel } from '../model/SharedModel';
import Option from '@/components/Option.vue';
import {
    GridPlugin,
    Resize,
    Filter,
    Page,
    Sort,
    Toolbar,
    ExcelExport,
    GridComponent,
    ContextMenu
} from '@syncfusion/ej2-vue-grids';

Vue.use(GridPlugin);

@Component({
    provide: {
        grid: [Page, Sort, Toolbar, ExcelExport, ContextMenu, Resize, Filter]
    },
    components: {
        Option
    }
})
export default class Universe extends Vue {
    private data: any[] = [];
    private pageSettings = { pageSize: 20 };
    private toolbar = ['ExcelExport'];
    private contextMenuItems = [{ text: 'Add Portfolio', id: 'addPortfolio' }];
    private selectionOptions = { type: 'Multiple' };
    private filterOptions = { type: 'Menu' };
    private filter = { type: 'CheckBox' };

    public async created() {
        const result = await axios(
            'https://localhost:5001/api/values/Universe'
        );
        const data = result.data;
        const temp: any[] = [];
        data.forEach((x: SharedModel.Subject) => {
            const element = {
                assetCode: x.assetCode,
                assetName: x.assetName,
                exchange: x.exchange,
                sector: x.sector,
                industry: x.industry,
                marketCap: x.marketCap,
                per: x.per,
                pbr: x.pbr,
                evEvitda: x.evEvitda,
                divYield: x.divYield
            };
            temp.push(element);
        });

        this.data = temp;
    }

    private toolbarClick(args: any) {
        if (args.item.id === 'universeGrid_excelexport') {
            const gridComponent = this.$refs.grid as GridComponent;
            gridComponent.excelExport();
        }
    }

    private async contextMenuClick(args: any) {
        if (args.item.id === 'addPortfolio') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];

            const codes: string[] = [];
            selectedrecords.forEach((x: SharedModel.Subject) => {
                codes.push(x.assetCode);
            });

            axios({
                url: 'https://localhost:5001/api/values/AddPortfolio',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    startDate: this.$store.state.option.startDate,
                    assetCodes: codes
                }
            });
        }
    }
}
</script>