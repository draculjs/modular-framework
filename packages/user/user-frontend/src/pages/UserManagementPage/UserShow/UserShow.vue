<template>
    <crud-show title="user.showTitle" :open="open"  @close="$emit('close')">

        <v-card-text>
            <user-show-data :item="item"/>
        </v-card-text>

    </crud-show>
</template>

<script>
    import UserShowData from "./UserShowData";
    import {CrudShow} from '@dracul/common-frontend'

    export default {
        name: "UserShow",
        components: {CrudShow, UserShowData},
        props: {
            item: Object,
            open: Boolean
        }
    }
</script>

