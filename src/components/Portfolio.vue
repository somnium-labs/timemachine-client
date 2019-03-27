<template>
    <v-data-table
        :headers="headers"
        :items="desserts"
        :pagination.sync="pagination"
        class="elevation-1"
        dark
    >
        <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.assetCode }}</td>
            <td class="text-xs-left">{{ props.item.assetName }}</td>
            <td class="text-xs-left">{{ props.item.exchange }}</td>
            <td class="text-xs-left">{{ props.item.sector }}</td>
            <td class="text-xs-left">{{ props.item.industry }}</td>
            <td class="text-xs-left">{{ props.item.marketCap }}</td>
            <td class="text-xs-left">{{ props.item.per }}</td>
            <td class="text-xs-left">{{ props.item.pbr }}</td>
            <td class="text-xs-left">{{ props.item.evEvitda }}</td>
            <td class="text-xs-left">{{ props.item.divYield }}</td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { SharedModel } from '../model/SharedModel';

@Component
export default class Portfolio extends Vue {
    @Prop() private msg!: string;

    private pagination: any;
    private headers: any;
    private desserts: any = [];

    public constructor() {
        super();
        this.pagination = {
            rowsPerPage: 20
        };
    }

    private async created() {
        this.headers = [
            {
                text: 'Code',
                align: 'left',
                sortable: false,
                value: 'assetCode'
            },
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
                'https://localhost:44364/api/values/Universe?exchange=NIKKEI'
            );
            const data = result.data;
            data.forEach((x: SharedModel.Universe) => {
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
                this.desserts.push(element);
            });
        } catch (error) {
            console.log(error);
        }
    }
}
</script>
