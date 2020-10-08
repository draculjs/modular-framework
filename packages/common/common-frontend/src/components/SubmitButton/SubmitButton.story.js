import SubmitButton from "./SubmitButton"
import i18n from "../../i18n"
import { withKnobs, boolean } from "@storybook/addon-knobs";

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Components|SubmitButton",
    decorators: [decorator,withKnobs]
};


const data = []

export const normal = () => ({
    components: {SubmitButton},
    props: {
        data: {default: data}
    },
    template: '<SubmitButton />',
    i18n
})

export const danger = () => ({
    components: {SubmitButton},
    props: {
        data: {default: data}
    },
    template: '<SubmitButton :danger="true" text="common.delete" />',
    i18n
})

export const disabled = () => ({
    components: {SubmitButton},
    props: {
        data: {default: data}
    },
    template: '<SubmitButton :disabled="true" />',
    i18n
})

export const loading = () => ({
    components: {SubmitButton},
    props: {
        loading: {default: boolean('Loading', true)}
    },
    template: '<SubmitButton :loading="loading" />',
    i18n
})