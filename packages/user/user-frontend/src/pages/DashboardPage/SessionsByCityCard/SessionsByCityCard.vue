<template>
    <v-card>
        <v-card-title v-t="'session.card.sessionsByCity'">Sessions By City</v-card-title>
        <v-card-text>
            <bar-chart :chart-data="getData"></bar-chart>
        </v-card-text>
    </v-card>
</template>

<script>
    import ChartsMixin from "../../../mixins/ChartsMixin";
    import BarChart from "../../../components/charts/BarChart";

    export default {
        name: "SessionsByCityCard",
        components: {BarChart},
        mixins: [ChartsMixin],
        props: {
            data: Array,
            height: {
                type: Number, default: 200
            }
        },
        computed: {
            getData() {
                let obj = {labels: ['Sessions'], datasets: []}
                this.data.forEach((i,index) => {
                        obj.datasets[index] = {data: [], label: i.city, backgroundColor: this.backgroundColor[index]}
                        obj.datasets[index].data.push(i.sum)

                })
                return obj
            }
        }
    }
</script>

<style scoped>

</style>
