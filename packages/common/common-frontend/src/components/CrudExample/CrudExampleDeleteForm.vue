<template>
    <crud-delete :open="open"
                 :loading="loading"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >
        <h4>{{$t('common.areYouSureDeleteRecord')}}</h4>
    </crud-delete>

</template>

<script>
    import CrudDelete from "../Crud/CrudDelete/CrudDelete";

    export default {
        name: "CrudExampleDeleteForm",
        components: {CrudDelete},
        props: {
            open: {type: Boolean, default: false},
            item: {type: Object}
        },
        data() {
            return {
                loading: false,
                errorMessage: "Some Error",
                deleteConfirm: false
            }
        },
        methods: {
            remove() {
                //Implement Delete
                this.loading=true
                setTimeout(()=>{
                    this.deleteConfirm = true
                    this.loading= false
                    this.$emit('deleted',this.item)
                },1000)
            }
        }
    }
</script>

<style scoped>

</style>