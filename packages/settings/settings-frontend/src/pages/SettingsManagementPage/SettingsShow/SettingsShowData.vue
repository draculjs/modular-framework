<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.key" :label="$t('settings.settings.labels.key')" icon="fingerprint"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.value" :label="$t('settings.settings.labels.value')" icon="text_snippet"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.label.en" :label="$t('settings.settings.labels.label') + '(en)'" icon="label"/>
                <show-field :value="item.label.es" :label="$t('settings.settings.labels.label') + '(es)'" icon="label"/>
                <show-field :value="item.label.pt" :label="$t('settings.settings.labels.label') + '(pt)'" icon="label"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'


    export default {
        name: 'SettingsShowData',
        components: {ShowField},

        props: {
            item: {type: Object, required: true}
        }
    }
</script>

