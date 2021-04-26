<template>
    <v-card>
        <v-card-title outlined>
            <div v-t="'customization.lang.title'"></div>
            <br>
        </v-card-title>
        <v-card-subtitle v-t="'customization.lang.subtitle'">
        </v-card-subtitle>
        <v-card-text>
            <v-form ref="langForm" autocomplete="off" @submit.prevent="saveLang">
                <v-row>
                    <v-col cols="12" md="3" lg="3">
                        <v-select
                                prepend-icon="language"
                                class="pa-3"
                                :items="langs"
                                :item-text="'text'"
                                :item-value="'value'"
                                color="secondary"
                                item-color="secondary"
                                v-model="formLang.language"
                                :label="$t('customization.lang.form.lang')"
                                required
                        ></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-btn @click="saveLang" text color="blue darken-4" v-t="'customization.applyButton'"></v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    import CustomizationProvider from "../../../../providers/CustomizationProvider";
    import {ClientError} from "@dracul/user-frontend";
    import {mapMutations} from "vuex";

    export default {
        name: 'customization-lang',
        props: {
            formLang: {type:Object},
            langs: {type: Array},
        },
        methods:{
            ...mapMutations([
                'setLanguage'
            ]),
            saveLang() {
                CustomizationProvider.updateLanguage(this.formLang).then(r => {
                    this.$root.$i18n.locale = r.data.langUpdate.language
                    this.setLanguage(r.data.langUpdate.language)
                }).catch(error => {
                    let clientError = new ClientError(error)
                    this.inputErrors = clientError.inputErrors
                    this.errorMessage = clientError.showMessage
                })
            },
        }
    }
</script>
