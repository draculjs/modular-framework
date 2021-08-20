<template>
    <v-card :to="{name:'groupManagement'}">
        <v-row class="ma-0" align="center">
            <v-col cols="3" >
                <v-icon size="72" color="indigo">supervised_user_circle</v-icon>
            </v-col>
            <v-col cols="8">
                <v-card-title class="subtitle-1 pl-0  pt-0"  v-t="'group.title'" ></v-card-title>
                <v-card-subtitle class="pl-0 pb-0" v-t="'group.description'"></v-card-subtitle>
            </v-col>
            <v-col cols="1" class="px-0" >
                <v-icon color="teal">arrow_forward</v-icon>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
    export default {
        name: 'adminGroupsCard',
    }
</script>
