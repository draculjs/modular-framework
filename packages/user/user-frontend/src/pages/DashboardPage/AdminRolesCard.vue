<template>
    <v-card :to="{name:'roleManagement'}">
        <v-row class="ma-0" align="center" >
            <v-col cols="3" >
                <v-icon size="68" color="purple">verified_user</v-icon>
            </v-col>
            <v-col cols="8">
                <v-card-title class="subtitle-1 pl-0  pt-0"  v-t="'role.title'" ></v-card-title>
                <v-card-subtitle class="pl-0 pb-0" v-t="'role.description'"></v-card-subtitle>
            </v-col>
            <v-col cols="1" class="px-0" >
                <v-icon color="teal">arrow_forward</v-icon>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
    export default {
        name: 'adminRolesCard',
    }
</script>
