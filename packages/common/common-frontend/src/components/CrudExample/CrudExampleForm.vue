<template>
    <v-form>
        <v-text-field label="Name" v-model="form.name"></v-text-field>
        <v-text-field label="Lastname" v-model="form.lastname"></v-text-field>
    </v-form>
</template>

<script>
    export default {
        name: "CrudExampleForm",
        props:{
            value: {
                type: Object,
                required: true
            }
        },
        computed: {
            form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        watch: {
            form: {
                handler(newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        },
    }
</script>

<style scoped>

</style>