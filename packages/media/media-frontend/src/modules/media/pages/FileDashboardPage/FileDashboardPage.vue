<template>
    <v-container class="elevation-4 mx-3 mt-6" white fluid>
        <h5 class="text-h4 mt-2">{{$t('media.file.dashboardTitle')}}</h5>
        <br>
        <v-row align="start" justify="center" v-if="fileGlobalMetrics">
            <v-col cols="12" sm="6" md="4">
                <v-card class="elevation-0 white" >
                    <v-card-text>
                        <file-bar-chart v-if="loadedFileBarChart" :chartdata="dataChart" :options="fileBarChartOptions"/>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card class="elevation-0 white text-center">
                    <file-pie-chart class="mb-2" v-if="loadedFilePieChartWeight" :chartdata="dataChartPieFileWeight" 
                        :title="$t('media.file.dashboard.almacenamientoPorUsuario.title')" :options="filePieChartOptions"/>
                    <span class="text-h5 font-weight-bold">
                        {{$t("media.file.dashboard.almacenamientoPorUsuario.subtitle")}}: {{fileGlobalMetrics.weight.toFixed(2)}} Mb
                    </span>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card class="elevation-0 white text-center" >
                    <file-pie-chart class="mb-2" v-if="loadedFilePieChartCount" :chartdata="dataChartPieFileCount" 
                        :title="$t('media.file.dashboard.cantidadArchivosPorUsuario.title')" :options="filePieChartOptions"/>
                    <span class="text-h5 font-weight-bold">
                        {{$t("media.file.dashboard.cantidadArchivosPorUsuario.subtitle")}}: {{fileGlobalMetrics.count}}
                    </span>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import fileMetricsProvider from "../../providers/FileMetricsProvider";
    import redeableBytesMixin from '../../mixins/readableBytesMixin';
    import FileBarChart from '../../components/FileBarChart'
    import FilePieChart from '../../components/FilePieChart'

    export default {
        name: "FileDashboardPage",
        mixins: [redeableBytesMixin],
        components: { FileBarChart, FilePieChart },
        data() {
            return {
                fileGlobalMetrics: null,
                fileUserMetrics:null,
                almacenamientoPorUsuario:null,
                loadedFileBarChart: false,
                loadedFilePieChartWeight: false,
                loadedFilePieChartCount: false,
                fileBarChartOptions: {
                    title: {
                        display: true,
                        text: this. $t("media.file.dashboard.fileUserMetrics.title"),
                        fontSize: '18'
                    },
                    plugins: {
                        labels: {
                            render: (value) => { 
                                if (value.percentage != 'Nan') {
                                    if (value.value % 1 == 0) {
                                        if (value.value != 0) {
                                            return Math.trunc(value.value)
                                        }
                                    } else {
                                        return value.value.toFixed(2)
                                    }
                                }
                            },
                            fontSize: '15',
                            fontColor: 'black'
                        },
                    },
                    legend: {
                        labels: {
                            fontSize: 15
                        }   
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    fontSize: 15
                                }
                            }
                        ], 
                        xAxes: [
                            {
                                ticks: {
                                    fontSize: 15
                                }
                            }
                        ], 
                    }
                },
                filePieChartOptions: {
                    plugins: {
                        labels: {
                            render: (value) => { 
                                if (value.percentage != 'Nan') {
                                    if (value.value % 1 == 0) {
                                        if (value.value != 0) {
                                            return Math.trunc(value.value) + ' (' + value.percentage + '%)'
                                        }
                                    } else {
                                        return value.value.toFixed(2) + ' (' + value.percentage + '%)'
                                    }
                                }
                            },
                            fontSize: '15',
                            fontColor: 'black',
                        },
                        title: {
                            fontSize: 20
                        }
                    },
                    legend: {
                        labels: {
                            fontSize: 15
                        }   
                    },
                },  
                dataChart: { },
                dataChartPieFileCount: { },
                dataChartPieFileWeight: { }
            }
        },
        created() {
            this.loadedFileBarChart = false
            this.loadedFilePieChartWeight = false
            this.loadedFilePieChartCount = false
            this.fetchFileGlobalMetrics()
            this.fetchFileUserMetrics()
            this.getAlmacenamientoPorUsuario()
            this.getCantidadArchivosPorUsuario()
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
                    this.dataChart.labels = results.labels

                    results.dataset[0].backgroundColor= [
                         'rgba(75, 192, 192)',
                         'rgba(75, 192, 192)',
                         'rgba(75, 192, 192)',
                         'rgba(75, 192, 192)',
                         'rgba(75, 192, 192)',
                    ];
                    results.dataset[0].label = this.$t(`media.file.dashboard.fileUserMetrics.countLabel`);

                    results.dataset[1].backgroundColor = [
                        'rgba(255, 205, 86)',
                        'rgba(255, 205, 86)',
                        'rgba(255, 205, 86)',
                        'rgba(255, 205, 86)',
                        'rgba(255, 205, 86)',
                    ];
                    results.dataset[1].label = this.$t(`media.file.dashboard.fileUserMetrics.sizeLabel`);

                    this.dataChart.datasets = results.dataset;
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    this.loadedFileBarChart = true
                })
            },
            getAlmacenamientoPorUsuario() {
                fileMetricsProvider.almacenamientoPorUsuario().then(r => {
                    let results = r.data.almacenamientoPorUsuario

                    this.dataChartPieFileWeight.datasets = [results.dataset[0]];
                    this.dataChartPieFileWeight.labels = results.labels;

                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    this.loadedFilePieChartWeight = true
                })
            },
            getCantidadArchivosPorUsuario() {
                fileMetricsProvider.cantidadArchivosPorUsuario().then(r => {
                    let results = r.data.cantidadArchivosPorUsuario

                    this.dataChartPieFileCount.datasets = [results.dataset[0]];
                    this.dataChartPieFileCount.labels = results.labels;

                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    this.loadedFilePieChartCount = true
                })
            },

        }
    }
</script>

<style scoped>

</style>
