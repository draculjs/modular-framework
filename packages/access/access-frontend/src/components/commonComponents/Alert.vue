<template>
    <v-snackbar 
        v-model="alert.model"
        bottom
        elevation="0" 
        color="rgba(0,0,0,0)">
        <v-alert :type="alert.type ? alert.type : 'warning'">{{alert.text ? alert.text : ''}}</v-alert>
    </v-snackbar>
</template>

<script>
    export default {
        name: 'AlertCommonComponent',
        props: {
            value: Object
        },
        computed: {
            alert:{
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>