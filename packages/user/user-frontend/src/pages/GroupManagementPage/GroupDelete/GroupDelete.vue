<template>
    <crud-delete :open="open"
                 :loading="loading"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
            <group-show-data :item="item"/>
        </v-card-text>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title" v-t="'common.areYouSureDeleteRecord'"></span>
            </v-row>
        </v-card-text>


    </crud-delete>
</template>

<script>
    import GroupShowData from "../GroupShow/GroupShowData";
    import GroupProvider from "../../../providers/GroupProvider";
    import {CrudDelete, ClientError} from '@dracul/common-frontend'

    export default {
        name: "GroupDelete",
        components: {CrudDelete, GroupShowData},
        props: {
            item: Object,
            open: Boolean
        },
        data() {
            return {
                modal: false,
                title: "group.deleteTitle",
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                this.loading = true
                GroupProvider.deleteGroup(this.item.id).then(result => {
                        if (result.data.groupDelete.deleteSuccess) {
                            this.$emit('groupDeleted', this.item)
                            this.$emit('close')
                        } else {
                            this.errorMessage = 'common.operation.fail'
                        }
                    }
                ).catch(error => {
                    let clientError = new ClientError(error)
                    this.errorMessage = clientError.i18nMessage
                }).finally(() => this.loading = false)
            },
        },
    }
</script>


