<template>
    <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text >
            <v-alert
                    color="success"
                    icon="check_circle"
                    outlined
                    v-t="'auth.changePasswordSuccessfully'"
            >
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" outlined  @click="$emit('close')" v-t="'common.close'">
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

    export default {
        name: "ProfilePasswordSuccess",
    }
</script>
