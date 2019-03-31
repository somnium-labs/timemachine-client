<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs6>
                <h3 style="margin-top: 0.28em">Start Date</h3>
            </v-flex>
            <v-flex xs6>
                <ejs-datepicker
                    :placeholder="waterMark"
                    :value="tradeOption.startDate"
                    :format="dateFormat"
                ></ejs-datepicker>
            </v-flex>
            <v-layout row wrap>
                <v-flex xs6>
                    <h3 style="margin-top: 0.28em">End Date</h3>
                </v-flex>
                <v-flex xs6>
                    <ejs-datepicker
                        :placeholder="waterMark"
                        :value="tradeOption.endDate"
                        :format="dateFormat"
                    ></ejs-datepicker>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SharedModel } from '../model/SharedModel';
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars';
import {
    InPlaceEditorComponent,
    InPlaceEditorPlugin
} from '@syncfusion/ej2-vue-inplace-editor';
import moment from 'moment';

Vue.use(InPlaceEditorPlugin);
Vue.use(DatePickerPlugin);

@Component
export default class Option extends Vue {
    private tradeOption!: SharedModel.TradeOption;
    private dateFormat: string = 'yyyy-MM-dd';

    private dropdownModel = {
        dataSource: ['Male', 'Female'],
        placeholder: 'Select gender'
    };

    private created() {
        this.tradeOption = {
            startDate: '2010-01-01',
            endDate: '2019-01-01'
        };
    }
}
</script>