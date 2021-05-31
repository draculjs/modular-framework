<template>
<crud-layout :title="title" :subtitle="subtitle">

        <template v-slot:list>
            <settings-list
                       ref="list"
                       @update="update"
                       @delete="remove"
                       @show="show"

            />
        </template>

         <add-button @click="create"></add-button>

        <settings-create v-if="creating"
                        :open="creating"
                        v-on:itemCreated="onItemCreated"
                        v-on:close="creating=false"
        />

        <settings-update v-if="updating"
                        :open="updating"
                        :item="itemToEdit"
                        v-on:itemUpdated="onItemUpdated"
                        v-on:close="updating=false"
        />

        <settings-show v-if="showing"
                           :open="showing"
                           :item="itemToShow"
                           v-on:close="showing=false"
         />

        <settings-delete v-if="deleting"
                         :open="deleting"
                         :item="itemToDelete"
                         v-on:itemDeleted="onItemDeleted"
                         v-on:close="deleting=false"
        />

        <snackbar v-model="flash"/>

</crud-layout>
</template>

<script>

    import SettingsCreate from "../SettingsCreate";
    import SettingsUpdate from "../SettingsUpdate";
    import SettingsDelete from "../SettingsDelete";
    import SettingsShow from "../SettingsShow";
    import SettingsList from "../SettingsList";

     import {CrudLayout, AddButton, Snackbar} from "packages/common/common-frontend/src"

    export default {
        name: "SettingsCrud",
        components: {
            CrudLayout, AddButton, Snackbar,
            SettingsCreate,
            SettingsUpdate,
            SettingsDelete,
            SettingsShow,
            SettingsList
        },
        data() {
            return {
                title: 'settings.settings.title',
                subtitle: 'settings.settings.subtitle',
                flash: null,
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
            }
        },
        methods: {
            //On
            onItemCreated() {
                this.$refs.list.fetch()
                this.flash= "common.created"
            },
            onItemUpdated() {
                this.$refs.list.fetch()
                this.flash= "common.updated"
            },
            onItemDeleted() {
                this.$refs.list.fetch()
                this.flash= "common.deleted"
            },
            //Open
            create() {
                this.creating = true
            },
            update(item) {
                this.updating = true
                this.itemToEdit = item
            },
            show(item) {
                this.showing = true
                this.itemToShow = item
            },
            remove(item) {
                this.deleting = true
                this.itemToDelete = item
            }
        }

    }
</script>


