<template>
      <crud-delete :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
          <settings-show-data :item="item" />
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>

    </crud-delete>
</template>

<script>
    //Provider
    import SettingsProvider from "../../../providers/SettingsProvider";

    //Show Data
    import SettingsShowData from "../SettingsShow/SettingsShowData";

    //Common
    import {CrudDelete, ClientError} from 'packages/common/common-frontend/src'

    export default {
        name: "SettingsDelete",

        components: {SettingsShowData, CrudDelete},

        props: {
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                modal: false,
                title: 'settings.settings.deleting',
                areYouSure: this.$t('common.areYouSureDeleteRecord'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                this.loading = true
                SettingsProvider.deleteSettings(this.item.id).then(result => {
                            if (result.data.settingsDelete.success) {
                                this.$emit('itemDeleted',result.data.settingsDelete)
                                this.$emit('close')
                            }else{
                                this.errorMessage = 'Error on Delete'
                            }
                        }
                    ).catch(error =>{
                        let clientError = new ClientError(error)
                        this.errorMessage = clientError.showMessage
                }).finally(() => this.loading = false)
            },
        },
    }
</script>


