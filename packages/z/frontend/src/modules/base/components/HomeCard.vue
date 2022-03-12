<template>
    <v-col cols="12" sm="6" md="4">
        <v-card

        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{title}}</v-list-item-title>
                    <v-list-item-subtitle>{{subtitle}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-img width="100%" height="140px" :src="img" contain></v-img>

            <v-card-actions class="text-center">
                <v-spacer></v-spacer>
                <v-btn
                        text
                        color="deep-purple accent-4"
                        :to="link"
                >
                    Ingresar
                </v-btn>


            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
    export default {
        name: "HomeCard",
        props: {
            title: String,
            subtitle: String,
            description: String,
            img: String,
            link: Object
        }
    }
</script>

<style scoped>

</style>
