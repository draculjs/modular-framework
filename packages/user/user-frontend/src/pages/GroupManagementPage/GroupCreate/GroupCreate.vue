<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <group-form ref="form" v-model="form" :input-errors="inputErrors"></group-form>
    </crud-create>
</template>

<script>
    import GroupProvider from "../../../providers/GroupProvider";
    import UserValidations from "../../../mixins/UserValidations";
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    import GroupForm from "../GroupForm/GroupForm";

    export default {
        name: "GroupCreate",
        components: {GroupForm, CrudCreate},
        mixins: [UserValidations],
        props:{
          open: Boolean
        },
        data() {
            return {
                modal: false,
                title: this.$t('group.createTitle'),
                inputErrors:{},
                errorMessage: '',
                loading: false,
                loadingUsers: false,
                users: [],
                form: {
                    name: '',
                    color: '#37474F',
                    users: []
                }

            }
        },
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    GroupProvider.createGroup(this.form).then(r => {
                            if (r) {
                                this.$emit('groupCreated', r.data.groupCreate)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(()=>this.loading=false)
                }

            },


        },
    }
</script>

<style scoped>

</style>

