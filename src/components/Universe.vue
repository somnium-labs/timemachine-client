<template>
    <div>
        <H3>Universe</H3>
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
            :dataBound="dataBound"
            :rowDataBound="rowDataBound"
        >
            <e-columns>
                <!--
                <e-column field="rowNumber" headerText="Row" textAlign="left"></e-column>
                -->
                <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
                <e-column
                    field="assetName"
                    headerText="Name"
                    textAlign="left"
                    clipMode="EllipsisWithTooltip"
                ></e-column>
                <e-column field="exchange" headerText="Exchange" textAlign="left" :filter="filter"></e-column>
                <e-column field="firstDate" headerText="First Date" textAlign="left"></e-column>
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
                <e-column
                    field="recentVolatility1Year"
                    headerText="Y1"
                    textAlign="center"
                    format="P2"
                ></e-column>
                <e-column
                    field="recentVolatility3Year"
                    headerText="Y3"
                    textAlign="center"
                    format="P2"
                ></e-column>
                <e-column
                    field="recentVolatility5Year"
                    headerText="Y5"
                    textAlign="center"
                    format="P2"
                ></e-column>
                <e-column
                    field="recentVolatility7Year"
                    headerText="Y7"
                    textAlign="center"
                    format="P2"
                ></e-column>
                <e-column
                    field="recentVolatility10Year"
                    headerText="Y10"
                    textAlign="center"
                    format="P2"
                ></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import axios from 'axios';
import { SharedModel } from '../model/SharedModel';
import Option from '@/components/Option.vue';
import Home from '@/views/Home.vue';
import {
    GridPlugin,
    Resize,
    Filter,
    Page,
    Sort,
    Toolbar,
    ExcelExport,
    ExcelExportProperties,
    GridComponent,
    ContextMenu,
    RowDataBoundEventArgs
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
    private originData: any[] = [];

    private pageSettings = { pageSize: 20 };
    private toolbar = ['ExcelExport'];
    private contextMenuItems = [
        { text: 'Add Portfolio', id: 'addPortfolio' },
        { text: 'Select', id: 'select' },
        { text: 'Reset', id: 'reset' }
    ];
    private selectionOptions = { type: 'Multiple' };
    private filterOptions = { type: 'Menu' };
    private filter = { type: 'CheckBox' };

    public async created() {
        const result = await axios(
            `${this.$store.state.url}/api/values/Universe`
        );
        const data = result.data;
        const temp: any[] = [];
        let row: number = 0;
        data.forEach((x: SharedModel.Subject) => {
            const element = {
                rowNumber: (row++ % 20) + 1,
                firstDate: x.firstDate,
                assetCode: x.assetCode,
                assetName: x.assetName,
                exchange: x.exchange,
                sector: x.sector,
                industry: x.industry,
                marketCap: x.marketCap,
                per: x.per,
                pbr: x.pbr,
                evEvitda: x.evEvitda,
                divYield: x.divYield,
                recentVolatility1Year: x.recentVolatility1Year,
                recentVolatility3Year: x.recentVolatility3Year,
                recentVolatility5Year: x.recentVolatility5Year,
                recentVolatility7Year: x.recentVolatility7Year,
                recentVolatility10Year: x.recentVolatility10Year
            };
            temp.push(element);
        });

        this.data = temp;
        this.originData = temp;
    }

    private toolbarClick(args: any) {
        if (args.item.id === 'universeGrid_excelexport') {
            const gridComponent = this.$refs.grid as GridComponent;
            const exportProperties: ExcelExportProperties = {
                hierarchyExportMode: 'All' // Expanded, All, None
            };
            gridComponent.excelExport(exportProperties);
        }
    }

    private async contextMenuClick(args: any) {
        if (args.item.id === 'addPortfolio') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];

            const parent = this.$parent as Home;
            parent.addPortfolio(selectedrecords);
        } else if (args.item.id === 'select') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];
            this.data = selectedrecords;
        } else if (args.item.id === 'reset') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as SharedModel.Subject[];
            this.data = this.originData;
        }
    }

    private dataBound() {
        const gridComponent = this.$refs.grid as GridComponent;
        gridComponent.autoFitColumns([
            // 'rowNumber',
            'assetCode',
            'assetName',
            'sector'
        ]);
    }

    private rowDataBound(args: RowDataBoundEventArgs) {
        (args.data as SharedModel.Subject).rowNumber =
            parseInt(
                (args.row as Element).getAttribute('aria-rowindex') as string,
                10
            ) + 1;
    }
}
</script>