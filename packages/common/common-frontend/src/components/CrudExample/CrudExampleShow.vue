<template>
    <crud-show  :open="open"  @close="$emit('close')">
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-list>
                    <show-field :value="item.name" :label="$t('common.name')" icon="account_box"/>
                </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="4">
                <v-list>
                    <show-field :value="item.lastname" :label="$t('common.lastname')" icon="account_circle"/>
                </v-list>
            </v-col>
        </v-row>
    </crud-show>

</template>

<script>
    import CrudShow from "../Crud/CrudShow/CrudShow";
    import ShowField from "../ShowField/ShowField";

    export default {
        name: "CrudExampleShow",
        components: {ShowField, CrudShow},
        props: {
            open: {type: Boolean, default: false},
            item: Object
        }
    }
</script>

<style scoped>

</style>