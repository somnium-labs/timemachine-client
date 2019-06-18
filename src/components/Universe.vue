<template>
    <div>
        <H3 style="color: white;">Universe</H3>
        <ejs-combobox
            ref="country"
            id="country"
            showClearButton="false"
            :dataSource="countrySource"
            :change="change"
            width="200"
        ></ejs-combobox>
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
                <e-column field="rowNumber" headerText="No" textAlign="left" width="50" :allowSorting="false" :allowFiltering="false"></e-column>
                <e-column field="assetCode" headerText="Code" textAlign="left"></e-column>
                <e-column
                    field="assetName"
                    headerText="Name"
                    textAlign="left"
                    clipMode="EllipsisWithTooltip"
                ></e-column>
                <e-column field="exchange" headerText="Exchange" textAlign="left" :filter="filter"></e-column>
                <e-column
                    field="firstDate"
                    headerText="First Date"
                    textAlign="left"
                    :format="{ type: 'date', format: 'yyyy-MM-dd' }"
                    type="date"
                ></e-column>
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
                <e-column field="per" headerText="PER" textAlign="center" width="80"></e-column>
                <e-column field="pbr" headerText="PBR" textAlign="center" width="80"></e-column>
                <e-column field="evEvitda" headerText="EV/EVITDA" textAlign="center" width="80"></e-column>
                <e-column field="divYield" headerText="Div Yield" textAlign="center" width="80"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import axios from 'axios';
import { ISubject } from '../model/SharedModel';
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
import {
    ComboBoxPlugin,
    ComboBoxComponent
} from '@syncfusion/ej2-vue-dropdowns';
import moment from 'moment';

Vue.use(GridPlugin);
Vue.use(ComboBoxPlugin);

@Component({
    provide: {
        grid: [Page, Sort, Toolbar, ExcelExport, ContextMenu, Resize, Filter]
    },
    components: {
        Option
    }
})
export default class Universe extends Vue {
    private data: ISubject[] = [];
    private originData: ISubject[] = [];
    private countrySource = ['JP', 'KR', 'FX_1D', 'FX_1W', 'FX_60M'];

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

    private bRefresh: boolean = false;

    public async created() {
        this.$store.state.option.country = 'JP';
        await this.getUniverse('JP', undefined);
    }

    private mounted() {
        const countryComboBox = this.$refs.country as ComboBoxComponent;
        countryComboBox.ej2Instances.value = 'JP';
    }

    private async getUniverse(country: string, exchange?: string) {
        const uri = exchange
            ? `${
                  this.$store.state.url
              }/api/values/Universe/${country}/${exchange}`
            : `${this.$store.state.url}/api/values/Universe/${country}`;
        const result = await axios(uri);
        const data = result.data;
        const temp: any[] = [];
        let row: number = 0;
        data.forEach((x: ISubject) => {
            const element = {
                rowNumber: (row++ % 20) + 1,
                firstDate: moment(x.firstDate as Date),
                assetCode: x.assetCode,
                assetName: x.assetName,
                exchange: x.exchange,
                sector: x.sector,
                industry: x.industry,
                marketCap: x.marketCap,
                per: x.per,
                pbr: x.pbr,
                evEvitda: x.evEvitda
                // divYield: x.divYield,
                // recentVolatility1Year: x.recentVolatility1Year,
                // recentVolatility3Year: x.recentVolatility3Year,
                // recentVolatility5Year: x.recentVolatility5Year,
                // recentVolatility7Year: x.recentVolatility7Year,
                // recentVolatility10Year: x.recentVolatility10Year
            };
            temp.push(element);
        });

        this.setData(temp);
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
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as ISubject[];

            const parent = this.$parent as Home;
            parent.addPortfolio(selectedrecords);
        } else if (args.item.id === 'select') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as ISubject[];
            this.setData(selectedrecords);
        } else if (args.item.id === 'reset') {
            const gridComponent = this.$refs.grid as GridComponent;
            const selectedrecords = (gridComponent.getSelectedRecords() as any) as ISubject[];
            this.setData(this.originData);
        }
    }

    private dataBound() {
        const gridComponent = this.$refs.grid as GridComponent;
        gridComponent.autoFitColumns([
            // 'rowNumber',
            'assetCode',
            // 'assetName',
            'sector'
        ]);
    }

    private rowDataBound(args: RowDataBoundEventArgs) {
        const rowNumber: number = parseInt(
                (args.row as Element).getAttribute('aria-rowindex') as string,
                10
            ) + 1;

        if ((args.data as ISubject).rowNumber !== rowNumber) {
            (args.data as ISubject).rowNumber = rowNumber;
            this.bRefresh = true;
            }

        if ((rowNumber >= this.data.length || rowNumber >= 20) && this.bRefresh) {
            this.bRefresh = false;
            const gridComponent = this.$refs.grid as GridComponent;
            gridComponent.refresh();
        }
    }

    private change(args: any) {
        if (args.element.id === 'country') {
            this.$store.state.option.country = args.itemData.value;

            const selectedUniverse = args.itemData.value as string;

            if (selectedUniverse.indexOf('FX') !== -1) {
                this.getUniverse('JP', selectedUniverse);
            } else {
                this.getUniverse(args.itemData.value);
            }
        }
    }

    private setData(value: ISubject[]) {
        this.data = value;
    }
}
</script>