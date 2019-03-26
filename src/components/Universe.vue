<template>
    <p>{{msg}}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Universe extends Vue {
    @Prop() private msg!: string;
}
</script>

<style>
</style>
