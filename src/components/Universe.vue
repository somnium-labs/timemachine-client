<template>
    <v-layout row wrap>
        <v-flex xs3>
            <v-text-field
                append-icon="mdi-magnify"
                label="Filter"
                single-line
                hide-details
                @input="filterSearch"
            ></v-text-field>
        </v-flex>
        <v-flex xs3>
            <v-select :items="assetNames" label="Name" @change="filterName"></v-select>
        </v-flex>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="rows"
            :search="search"
            :loading="loading"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            item-key="assetCode"
            select-all
            class="elevation-1"
            dark
        >
            <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
            <template v-slot:items="props">
                <td>
                    <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                </td>
                <td class="text-xs-left">{{ props.item.assetCode }}</td>
                <td class="text-xs-left">{{ props.item.assetName }}</td>
                <td class="text-xs-left">{{ props.item.exchange }}</td>
                <td class="text-xs-left">{{ props.item.sector }}</td>
                <td class="text-xs-left">{{ props.item.industry }}</td>
                <td class="text-xs-left">{{ formatCap(props.item.marketCap) }}</td>
                <td class="text-xs-left">{{ props.item.per }}</td>
                <td class="text-xs-left">{{ props.item.pbr }}</td>
                <td class="text-xs-left">{{ props.item.evEvitda }}</td>
                <td class="text-xs-left">{{ props.item.divYield }}</td>
            </template>
            <v-alert
                v-slot:no-results
                :value="true"
                color="error"
                icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
        </v-data-table>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import numeral from 'numeral';
import { SharedModel } from '../model/SharedModel';

@Component
export default class Universe extends Vue {
    private pagination: any;
    private rowsPerPageItems: number[];
    private selected: any[] = [];
    private search: string = '';
    private loading: boolean = true;

    private headers: any;
    private rows: any = [];

    public constructor() {
        super();
        this.pagination = {
            rowsPerPage: 20
        };
        this.rowsPerPageItems = [10, 20];
    }

    private formatCap(cap: number) {
        return numeral(cap).format('0,0');
    }

    private async created() {
        this.headers = [
            { text: 'Code', value: 'assetCode' },
            { text: 'Name', value: 'assetName' },
            { text: 'Exchange', value: 'exchange' },
            { text: 'Sector', value: 'sector' },
            { text: 'Industry', value: 'industry' },
            { text: 'Market Cap', value: 'marketCap' },
            { text: 'PER', value: 'per' },
            { text: 'PBR', value: 'pbr' },
            { text: 'EV/EVITDA', value: 'evEvitda' },
            { text: 'Div Yield', value: 'divYield' }
        ];

        try {
            const result = await axios(
                //'https://localhost:5001/api/values/Universe?exchange=NIKKEI'
                'https://localhost:5001/api/values/Universe'
            );
            const data = result.data;
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
                this.rows.push(element);
            });
            this.loading = false;
        } catch (error) {
            console.log(error);
        }
    }

    private customFilter(items: any, filters: any, filter: any, headers: any) {
        const cf = new this.$MultiFilters(items, filters, filter, headers);
    }
}
</script>
