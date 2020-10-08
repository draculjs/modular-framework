<script>

    import {HorizontalBar, mixins} from 'vue-chartjs'
    import 'chartjs-plugin-labels';



    export default {
        mixins: [mixins.reactiveProp],
        extends: HorizontalBar,
        props: {
            options: {type: Object,
                default: function() {
                    return {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            labels: {
                                render: 'percentage',
                                fontColor: 'black'
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

