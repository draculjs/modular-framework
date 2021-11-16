
<script>
    import { Pie } from 'vue-chartjs'

    export default {
        extends: Pie,
        name: "PieChart",
        mounted () {
            this.options.title = { display: true, text: this.title, fontSize: '18' };
            this.renderChart(this.chartdata, this.options)
        },
        props: {
            chartdata: Object,
            options: Object,
            title: String
        },
    }
</script>

<style scoped>

</style>