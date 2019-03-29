<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xl8>
                <Universe msg="Welcome to Your Vue.js + TypeScript App"/>
            </v-flex>
            <v-flex xl4>
                <Portfolio/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Universe from '@/components/Universe.vue'; // @ is an alias to /src
import Portfolio from '@/components/Portfolio.vue'; // @ is an alias to /src

@Component({
    components: {
        Universe,
        Portfolio
    }
})
export default class Home extends Vue {}
</script>
