<template>
    <v-card >
        <v-card-title v-t="'session.card.sessionsByCountry'"></v-card-title>
        <v-card-text>
        <map-chart
                style="z-index: 2"
                :country-data="getData"
                highColor="#ff0000"
                lowColor="#aaaaaa"
                countryStrokeColor="#909090"
                defaultCountryFillColor="#dadada"
                :showLegend="true"
        />
        </v-card-text>
    </v-card>
</template>

<script>
    import MapChart from 'vue-map-chart'

    export default {
        name: "SessionsByCountryCard",
        components: {MapChart},
        props: {
            data: Array,
            height: {
                type: Number, default: 200
            }
        },
        computed: {
            getData() {
                let obj = {}

                this.data.forEach(i => {
                    obj[i.country] = i.sum
                })
                return obj
            }
        }

    }
</script>

<style scoped>

</style>
