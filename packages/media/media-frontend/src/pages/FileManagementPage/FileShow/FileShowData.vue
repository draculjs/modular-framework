<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.filename" :label="$t('media.file.filename')" icon="description"/>
                 <show-field :value="item.absolutePath" :label="$t('media.file.absolutePath')" icon="folder"/>
                 <show-field :value="item.createdAt" :label="$t('media.file.createdAt')" icon="event"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.extension" :label="$t('media.file.extension')" icon="extension"/>
                 <show-field :value="item.size.toString()" :label="$t('media.file.size')" icon="photo_size_select_actual"/>
                 <show-field :value="item.createdBy.user.name" :label="$t('media.file.createdBy')" icon="account_circle"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.relativePath" :label="$t('media.file.relativePath')" icon="folder_open"/>
                 <show-field :value="item.url" :label="$t('media.file.url')" icon="link"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
    
    export default {
        name: 'FileShowData',
        components: {ShowField},
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

