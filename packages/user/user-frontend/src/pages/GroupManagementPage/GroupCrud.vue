<template>
    <crud-layout title="group.title" subtitle="group.description">

        <template v-slot:list>
            <group-list
                    ref="list"
                    @open-delete="openDelete"
                    @open-edit="openEdit"
                    @open-show="openShow"
            ></group-list>
        </template>

        <group-show v-if="showing"
                    :open="showing"
                    :item="itemToShow"
                    v-on:close="showing=false"/>


        <group-delete v-if="deleting"
                      :open="deleting"
                      :item="itemToDelete"
                      @groupDeleted="onGroupDeleted"
                      v-on:close="deleting=false"
        />


        <group-create v-if="creating"
                      :open="creating"
                      v-on:groupCreated="onGroupCreated"
                      v-on:close="creating=false"
        />


        <group-update v-if="updating"
                      :open="updating"
                      :item="itemToEdit"
                      v-on:groupUpdated="onGroupUpdated"
                      v-on:close="updating=false"
        />


        <add-button @click="creating = true"></add-button>

        <snackbar v-model="flashMessage"/>

    </crud-layout>
</template>

<script>
    import GroupShow from "./GroupShow";
    import GroupDelete from "./GroupDelete";
    import GroupCreate from "./GroupCreate";
    import GroupUpdate from "./GroupUpdate";
    import GroupList from "./GroupList";
    import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"

    export default {
        name: "GroupCrud",
        components: {CrudLayout, Snackbar, AddButton, GroupList, GroupUpdate, GroupCreate, GroupDelete, GroupShow},
        data() {
            return {
                title: this.$t('group.title'),
                description: this.$t('group.description'),
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                expanded: [],
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
                flashMessage: null
            }
        },
        methods: {
            onGroupCreated() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('group.created')
            },
            onGroupUpdated() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('group.updated')
            },
            onGroupDeleted() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('group.deleted')
            },
            openEdit(item) {
                this.updating = true
                this.itemToEdit = item
            },
            openShow(item) {
                this.showing = true
                this.itemToShow = item
            },
            openDelete(item) {
                this.deleting = true
                this.itemToDelete = item
            }

        },


    }
</script>

<style scoped>

</style>