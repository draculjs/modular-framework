<template>
<crud-layout :title="title" :subtitle="subtitle">

        <template v-slot:list>
            <queue-list
                       ref="list"
                       @delete="remove"
                       @show="show"

            />
        </template>




        <queue-show v-if="showing"
                           :open="showing"
                           :item="itemToShow"
                           v-on:close="showing=false"
         />

        <queue-delete v-if="deleting"
                         :open="deleting"
                         :item="itemToDelete"
                         v-on:itemDeleted="onItemDeleted"
                         v-on:close="deleting=false"
        />

        <snackbar v-model="flash"/>

</crud-layout>
</template>

<script>

    import QueueCreate from "../QueueCreate";
    import QueueUpdate from "../QueueUpdate";
    import QueueDelete from "../QueueDelete";
    import QueueShow from "../QueueShow";
    import QueueList from "../QueueList";

     import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"

    export default {
        name: "QueueCrud",
        components: {
            CrudLayout, AddButton, Snackbar,
            QueueCreate,
            QueueUpdate,
            QueueDelete,
            QueueShow,
            QueueList
        },
        data() {
            return {
                title: 'queue.queue.title',
                subtitle: 'queue.queue.subtitle',
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


