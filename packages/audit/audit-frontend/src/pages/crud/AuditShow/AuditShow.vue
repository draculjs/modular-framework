<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <audit-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import AuditShowData from "./AuditShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "AuditShow",
        components: {CrudShow, AuditShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'user.audit.showing',
            }
        },
    }
</script>

