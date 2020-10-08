<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
            <customization-management></customization-management>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import CustomizationManagement from "./CustomizationManagement";
    export default {
        name: "CustomizationPage",
        components: {CustomizationManagement}
    }
</script>

<style scoped>

</style>

