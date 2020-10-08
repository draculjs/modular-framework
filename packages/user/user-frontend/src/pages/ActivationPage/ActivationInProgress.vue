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
            {{ $t('auth.activatingUser') }}
        </v-col>
        <v-col cols="6">
            <v-progress-linear
                    color="primary"
                    indeterminate
                    rounded
                    height="6"
            ></v-progress-linear>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: 'ActivationInProgress',
        props: {
            activationStatus: {}
        }
    }
</script>