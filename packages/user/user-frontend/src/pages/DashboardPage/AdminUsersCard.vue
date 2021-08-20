<template>
    <v-card :to="{name:'userManagement'}">
        <v-row class="ma-0" align="center" >
            <v-col cols="3" >
                <v-icon size="72" color="teal">person_pin</v-icon>
            </v-col>
            <v-col cols="8">
                <v-card-title class="subtitle-1 pl-0  pt-0"  v-t="'user.title'" ></v-card-title>
                <v-card-subtitle class="pl-0 pb-0" v-t="'user.description'"></v-card-subtitle>
            </v-col>
            <v-col cols="1" class="px-0" >
                <v-icon color="teal">arrow_forward</v-icon>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
    export default {
        name: 'adminUsersCard',
    }
</script>


