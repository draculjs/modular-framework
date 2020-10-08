<template>
    <ul>
        <li v-for="item in items" :key="item.id">
            {{item.name}}
            <show-button @show="show(item)"/>
            <edit-button @edit="update(item)"/>
            <delete-button @delete="remove(item)"/>
        </li>
    </ul>
</template>

<script>
    import ShowButton from "../Crud/ShowButton/ShowButton";
    import EditButton from "../Crud/EditButton/EditButton";
    import DeleteButton from "../Crud/DeleteButton/DeleteButton";
    export default {
        name: "CrudExampleSimpleList",
        components: {DeleteButton, EditButton, ShowButton},
        data(){
            return {
                items: [
                    {id:1,name:"One"},
                    {id:2,name:"Two"},
                    {id:3,name:"Three"},
                ]
            }
        },
        methods: {
            remove(item){
                this.$emit('delete',item)
            },
            update(item){
                this.$emit('update',item)
            },
            show(item){
                this.$emit('show',item)
            }
        }
    }
</script>

<style scoped>

</style>