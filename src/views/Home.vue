<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <Universe msg="Welcome to Your Vue.js + TypeScript App"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Universe from '@/components/Universe.vue'; // @ is an alias to /src

@Component({
    components: {
        Universe
    }
})
export default class Home extends Vue {}
</script>
