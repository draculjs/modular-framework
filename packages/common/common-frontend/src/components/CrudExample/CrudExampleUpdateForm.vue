<template>
    <crud-update :open="open"
                 :loading="loading"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
        <crud-example-form v-model="form"/>
    </crud-update>

</template>

<script>
    import CrudUpdate from "../Crud/CrudUpdate/CrudUpdate";
    import CrudExampleForm from "./CrudExampleForm";

    export default {
        name: "CrudExampleUpdateForm",
        components: {CrudExampleForm, CrudUpdate},
        props: {
            open: {type: Boolean, default: false},
            item: {type: Object}
        },
        data() {
            return {
                loading: false,
                errorMessage: "Some Error",
                updateConfirm: false,
                form: {
                    id: this.item.id,
                    name: this.item.name,
                    lastname: this.item.lastname
                }
            }
        },
        methods: {
            update() {
                //Implement Update
                this.loading = true
                setTimeout(() => {
                    this.updateConfirm = true
                    this.loading = false
                    this.$emit('updated',this.form)
                }, 1000)
            }
        }
    }
</script>

<style scoped>

</style>