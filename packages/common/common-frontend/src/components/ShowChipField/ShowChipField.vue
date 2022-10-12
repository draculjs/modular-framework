<template>
    <v-list-item>
        <v-list-item-icon class="mr-5">
            <v-icon color="primary">{{icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="mr-0">
            <v-chip-group column>
                <v-chip v-for="chip in chips" 
                    :key="chip.id" 
                    color="primary lighten-2" 
                    text-color="white"
                    label
                    small
                >
                    {{ chip.name }}
                </v-chip>
            </v-chip-group>
            <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
    export default {
        name: 'ShowChipField',
        props: {
            chips: {type:Array, default:null},
            label: {type:String, default:null},
            icon: {type:String, default:'label_important'}
        },
        mounted() {
            console.log("CHIPS")
        }
    }
</script>
