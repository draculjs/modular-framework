<template>
    <v-text-field
            v-model="search"
            append-icon="search"
            :label="$t(label)"
            single-line
            hide-details
            v-on:keyup.native.enter="$emit('search')"
    ></v-text-field>
</template>

<script>
    export default {
        name: "SearchInput",
        props: {
            value: {type:String, default: ''},
            label: {type:String, default: 'common.search'}
        },
        computed: {
            search: {
                get(){
                    return this.value
                },
                set(val){
                    this.$emit('input',val)
                }
            }
        }
    }
</script>

<style scoped>

</style>