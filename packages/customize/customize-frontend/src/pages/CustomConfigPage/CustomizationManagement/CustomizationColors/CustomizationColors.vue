<template>
    <v-card outlined>
        <v-card-title>
            <div v-t="'customization.colors.title'"></div>
            <br>
        </v-card-title>
        <v-card-subtitle v-t="'customization.colors.subtitle'">
        </v-card-subtitle>
        <v-card-text class="pb-0 ">
            <v-form ref="colorsForm" autocomplete="off" @submit.prevent="$emit('save')">

                <v-row>
                    <v-col cols="12" sm="6" md="3" class="pb-0">
                        <color-input v-model="formColors.primary"
                                     :label="$t('customization.colors.primary')"
                                     color="secondary"
                                     :rules="[rules.required]"
                        />
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <color-input v-model="formColors.onPrimary"
                                     :label="$t('customization.colors.onPrimary')"
                                     color="secondary"
                                     :rules="[rules.required]"
                        />
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <color-input v-model="formColors.secondary"
                                     :label="$t('customization.colors.secondary')"
                                     color="secondary"
                                     :rules="[rules.required]"
                        />
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <color-input v-model="formColors.onSecondary"
                                     :label="$t('customization.colors.onSecondary')"
                                     color="secondary"
                                     :rules="[rules.required]"
                        />
                    </v-col>

                </v-row>
            </v-form>

        </v-card-text>

        <v-card-text class="pt-0 ">
            <v-row justify="center" align-content="center">
                <v-col cols="12" md="4" lg="4">
                    <v-card>
                        <v-card-title>
                            <div v-t="'customization.preview'"></div>
                        </v-card-title>
                        <v-card-text class="text-center">
                            <v-row>
                                <v-col cols="6" :style="getStyleColor('primary','onPrimary')">
                                    {{$t('customization.colors.primary')}}
                                </v-col>
                                <v-col cols="6" :style="getStyleColor('secondary','onSecondary')">
                                    {{$t('customization.colors.secondary')}}
                                </v-col>
                            </v-row>

                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-btn @click="saveColors" text color="blue darken-4" v-t="'customization.applyButton'"></v-btn>
        </v-card-actions>

    </v-card>
</template>
<script>
    import ColorInput from "./ColorInput"
    import CustomizationProvider from "../../../../providers/CustomizationProvider";
    import {ClientError} from "@dracul/user-frontend";
    import {mapMutations} from "vuex";

    export default {
        name: 'customization-colors',
        components: {ColorInput},
        props: {
            formColors: {},
        },
        methods: {
            ...mapMutations([
                'setColors'
            ]),
            saveColors() {
                if (this.$refs.colorsForm.validate()) {
                    CustomizationProvider.updateColors(this.formColors).then(r => {
                            this.setColors(r.data.colorsUpdate)
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.showMessage
                    })
                }
            },
        },
        computed: {
            getStyleColor() {
                return (color, onColor) => "background-color: " + this.formColors[color] + "; color: " + this.formColors[onColor]
            },
        },
        data() {
            return {
                inputErrors: [],
                rules: {
                    required: value => !!value || 'Requerido'
                },
            }
        }
    }
</script>
