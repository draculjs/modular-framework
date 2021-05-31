<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <settings-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import SettingsShowData from "./SettingsShowData";
    import {CrudShow} from 'packages/common/common-frontend/src'

    export default {
        name: "SettingsShow",
        components: {CrudShow, SettingsShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'settings.settings.showing',
            }
        },
    }
</script>

