<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <settings-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import SettingsCrud from "./SettingsCrud";
    export default {
        name: "Settings",
        components: {SettingsCrud}
    }
</script>

<style scoped>

</style>

