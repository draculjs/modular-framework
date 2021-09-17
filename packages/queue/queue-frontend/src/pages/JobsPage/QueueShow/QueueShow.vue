<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <queue-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import QueueShowData from "./QueueShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "QueueShow",
        components: {CrudShow, QueueShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'queue.queue.showing',
            }
        },
    }
</script>

