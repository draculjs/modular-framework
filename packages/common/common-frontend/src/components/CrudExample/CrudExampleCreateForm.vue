<template>
    <crud-create :open="open"
                 :loading="loading"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')">

        <crud-example-form v-model="form"/>

    </crud-create>

</template>

<script>
    import CrudCreate from "../Crud/CrudCreate/CrudCreate";
    import CrudExampleForm from "./CrudExampleForm";

    export default {
        name: "CrudExampleCreateForm",
        components: {CrudExampleForm, CrudCreate},
        props: {
            open: {type: Boolean, default: false}
        },
        data() {
            return {
                loading: false,
                errorMessage: "Some Error",
                createConfirm: false,
                form: {
                    id: null,
                    name: null,
                    lastname: null,
                }
            }
        },
        methods: {
            create() {
                this.loading = true
                setTimeout(() => {
                    this.createConfirm = true
                    this.loading = false
                    this.$emit('created', this.form)
                }, 1000)

            }
        }
    }
</script>

<style scoped>

</style>