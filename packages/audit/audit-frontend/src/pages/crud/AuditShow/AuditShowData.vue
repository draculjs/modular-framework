<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.user.username" :label="$t('audit.labels.user')" icon="person"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.action" :label="$t('audit.labels.action')" icon="build"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.target" :label="$t('audit.labels.targetResource')" icon="track_changes"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'AuditShowData',
        components: {ShowField},
        
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

