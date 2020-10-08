<script>

    import {Pie, mixins} from 'vue-chartjs'
    import 'chartjs-plugin-labels';



    export default {
        mixins: [mixins.reactiveProp],
        extends: Pie,
        props: {
            options: {type: Object,
                default: function() {
                    return {
                        plugins: {
                            labels: {
                                render: 'percentage',
                                fontColor: 'white'
                            }
                        }
                    }
                } }
        },
        mounted() {
            this.renderChart(this.chartData, this.options)
        }
    }
</script>

