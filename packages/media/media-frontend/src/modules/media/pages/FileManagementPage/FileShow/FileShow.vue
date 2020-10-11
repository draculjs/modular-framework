<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <file-view :file="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import {CrudShow} from '@dracul/common-frontend'
    import FileView from "../../../components/FileView/FileView";
 
    export default {
        name: "FileShow",
        components: {FileView, CrudShow},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'media.file.showing',
            }
        },
    }
</script>

