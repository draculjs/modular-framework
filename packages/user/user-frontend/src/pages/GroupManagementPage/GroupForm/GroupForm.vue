<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="$emit('save')">
        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                        prepend-icon="account_box"
                        name="name"
                        type="text"
                        v-model="form.name"
                        :label="$t('group.label.name')"
                        :placeholder="$t('group.label.name')"
                        class="pa-3"
                        :rules="required"
                        :error="hasInputErrors('name')"
                        :error-messages="getInputErrors('name')"
                        required
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <group-color-input v-model="form.color"
                                   :label="$t('group.label.color')"
                                   :get-message-errors="getInputErrors('color')"
                                   :has-errors="hasInputErrors('color')"
                                   :rules="colorRules"
                />
            </v-col>

            <v-col cols="12" sm="12">
              <user-autocomplete v-model="form.users" multiple ></user-autocomplete>
            </v-col>

        </v-row>


    </v-form>
</template>

<script>
    import UserProvider from "../../../providers/UserProvider";
    import GroupColorInput from "../GroupColorInput/GroupColorInput";
    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    import UserAutocomplete from "../../../components/UserAutocomplete";

    export default {
        name: "GroupForm",
        mixins: [InputErrorsByProps, RequiredRule],
        components: {UserAutocomplete, GroupColorInput},
        props:{
            value: {
                type: Object,
                required: true
            },
        },
        data(){
            return {
                users: [],
                loadingUsers: false,
                colorRules: [v => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 'hexcode invalid ']
            }
        },
        computed: {
            form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        watch: {
            form: {
                handler(newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        },
        created() {
            this.loadUsers()
        },
        methods:{
            validate(){
              return this.$refs.form.validate()
            },
            loadUsers(){
                this.loadingUsers = true
                UserProvider.users().then(r => {
                        this.users = r.data.users
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingUsers = false)
            },
        }
    }
</script>

