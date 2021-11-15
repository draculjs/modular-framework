
<script>
    import { Pie } from 'vue-chartjs'

    export default {
        extends: Pie,
        name: "PieChart",
        mounted () {
            this.renderChart(this.chartdata, this.options)
        },
        props: {
            chartdata: Object,
            options: Object
        },
        data() {
            return {
                title: ''
            }
        },
        methods: {
            
        }
    }
</script>

<style scoped>

</style>