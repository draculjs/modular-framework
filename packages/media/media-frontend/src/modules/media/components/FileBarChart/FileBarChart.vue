
<script>
    import { Bar } from 'vue-chartjs'

    export default {
        extends: Bar,
        name: "FileBarChart",
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