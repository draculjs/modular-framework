<template>
    <v-row
           class="fill-height"
           align-content="center"
           justify="center"
    >
        <v-col
                class="subtitle-1 text-center"
                cols="12"
        >
            <v-alert :value="true" color="error" class="ma-0" icon="check_circle" outlined>
                {{error}}
            </v-alert>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: 'ActivationError',
        props: {
            error: {type: String, default:"Error"}
        }
    }
</script>
