<template>
    <v-container>
        <h5 class="text-h5">    {{$t('media.file.dashboardTitle')}}</h5>
        <v-row v-if="fileGlobalMetrics">
            <v-col cols="12" sm="4" offset-sm="2">
                <v-card color="blue" dark>
                    <v-row>
                        <v-col cols="3" class="text-center">
                            <v-icon size="80">loupe</v-icon>
                        </v-col>
                        <v-col cols="9">
                            <h6 class="text-h6">COUNT</h6>
                            <h1 class=" text-h3 font-weight-bold">
                                {{fileGlobalMetrics.count}}
                            </h1>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card color="red" dark>
                    <v-row>
                        <v-col cols="3" class="text-center">
                            <v-icon size="80">fitness_center</v-icon>
                        </v-col>
                        <v-col cols="9">
                            <h6 class="text-h6">WEIGHT</h6>
                            <h1 class=" text-h3 font-weight-bold">
                                {{ fileGlobalMetrics.weight.toFixed(2) }} Mb
                            </h1>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="dflex justify-center">
            <v-card class="elevation-0 white" >
                <file-bar-chart v-if="loaded" :chartdata="dataChart" :options="options"/>
            </v-card>
        </v-row>
    </v-container>

</template>

<script>
    import fileMetricsProvider from "../../providers/FileMetricsProvider";
    import redeableBytesMixin from '../../mixins/readableBytesMixin';
    import FileBarChart from '../../components/FileBarChart'

    export default {
        name: "FileDashboardPage",
        mixins: [redeableBytesMixin],
        components: { FileBarChart },
        data() {
            return {
                fileGlobalMetrics: null,
                fileUserMetrics:null,
                loaded: false,
                options: {
                    title: {
                        display: true,
                        text: 'Predicted world population (millions) in 2050'
                    },
                    scales:{
                        yAxes: [{
                            display: false //this will remove all the x-axis grid lines
                        }]
                    }
                    //skipNull: true,
                },
                dataChart: {
                    // labels: ["enero","feb","mar","abr","may","jun","jul"],
                    // datasets: [{
                    //     label: 'My First Dataset',
                    //     data: [65, 59, 80, 81, 56, 55, 40],
                    //     backgroundColor: [
                    //     'rgba(255, 99, 132, 0.2)',
                    //     'rgba(255, 159, 64, 0.2)',
                    //     'rgba(255, 205, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)',
                    //     'rgba(54, 162, 235, 0.2)',
                    //     'rgba(153, 102, 255, 0.2)',
                    //     'rgba(201, 203, 207, 0.2)'
                    //     ],
                    //     borderColor: [
                    //     'rgb(255, 99, 132)',
                    //     'rgb(255, 159, 64)',
                    //     'rgb(255, 205, 86)',
                    //     'rgb(75, 192, 192)',
                    //     'rgb(54, 162, 235)',
                    //     'rgb(153, 102, 255)',
                    //     'rgb(201, 203, 207)'
                    //     ],
                    //     borderWidth: 1
                    // },{
                    //     label: 'My second Dataset',
                    //     data: [12, 23, 34, 45, 56, 67, 78],
                    //     backgroundColor: [
                    //     'rgba(255, 99, 132, 0.2)',
                    //     'rgba(255, 159, 64, 0.2)',
                    //     'rgba(255, 205, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)',
                    //     'rgba(54, 162, 235, 0.2)',
                    //     'rgba(153, 102, 255, 0.2)',
                    //     'rgba(201, 203, 207, 0.2)'
                    //     ],
                    //     borderColor: [
                    //     'rgb(255, 99, 132)',
                    //     'rgb(255, 159, 64)',
                    //     'rgb(255, 205, 86)',
                    //     'rgb(75, 192, 192)',
                    //     'rgb(54, 162, 235)',
                    //     'rgb(153, 102, 255)',
                    //     'rgb(201, 203, 207)'
                    //     ],
                    //     borderWidth: 1
                    // }]
                }
            }
        },
        created() {
            this.loaded = false
            this.fetchFileGlobalMetrics()
            this.fetchFileUserMetrics()
            // this.getMonths()
        },
        methods: {
            fetchFileGlobalMetrics() {
                fileMetricsProvider.fileGlobalMetrics().then(r => {
                    this.fileGlobalMetrics = r.data.fileGlobalMetrics
                    
                }).catch(err => {
                    console.error(err)
                })
            },
            fetchFileUserMetrics() {
                fileMetricsProvider.fileUserMetrics().then(r => {

                    this.fileUserMetrics = r.data.fileUserMetrics
                    let results = r.data.fileUserMetrics
                    console.log("usrmetrics", this.fileUserMetrics)
                    this.dataChart.labels = results.labels
                    results.dataset[0].backgroundColor= [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                        ]
                    this.dataChart.datasets = results.dataset
                    
                    console.log("datachart", this.dataChart)
                    // let userData = {
                    //     label: this.fileUserMetrics[0].user,
                    //     data: [this.fileUserMetrics[0].weight,0,0,0,0,0,0],
                    //     backgroundColor: 'rgba(111, 1, 1, 0.2)'
                    // }
                    // this.dataChart.datasets.push(userData)
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    this.loaded = true
                })
            }

        }
    }
</script>

<style scoped>

</style>
