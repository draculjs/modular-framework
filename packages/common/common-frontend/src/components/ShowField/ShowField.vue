<template>
    <v-list-item>
        <v-list-item-icon class="mr-5">
            <v-icon color="primary">{{icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="mr-0">
            <v-list-item-title>{{value}}</v-list-item-title>
            <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
    export default {
        name: 'ShowField',
        props: {
            value: {type:String, default:null},
            label: {type:String, default:null},
            icon: {type:String, default:'label_important'}
        }
    }
</script>
