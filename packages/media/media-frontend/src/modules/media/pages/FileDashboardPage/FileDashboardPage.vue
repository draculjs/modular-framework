<template>
    <div>
        <h5 class="text-h5">{{$t('media.file.dashboardTitle')}}</h5>
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
            <v-card class="elevation-0 white mr-3" >
                <file-bar-chart v-if="loadedFileBarChart" :chartdata="dataChart" :options="fileBarChartOptions"/>
            </v-card>
            <v-card class="elevation-0 white mr-3" >
                <file-pie-chart v-if="loadedFilePieChartWeight" :chartdata="dataChartPieFileWeight" title="Almacenamiento por usuario" :options="filePieChartOptions"/>
            </v-card>
            <v-card class="elevation-0 white" >
                <file-pie-chart v-if="loadedFilePieChartCount" :chartdata="dataChartPieFileCount" title="Cantidad de archivos por usuario" :options="filePieChartOptions"/>
            </v-card>
        </v-row>
    </div>

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
                        text: 'Indicadores de archivos de los últimos 5 meses'
                    },
                    plugins: {
                        labels: {
                            render: (value) => { 
                                if (value.percentage != 'Nan') {
                                    return value.value.toFixed(2)}
                                }
                        }
                    },
                },
                filePieChartOptions: {
                    plugins: {
                        labels: {
                            render: (value) => { return value.value.toFixed(2) }
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
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ];

                    results.dataset[1].backgroundColor = [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ];

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

                    results.dataset[0].backgroundColor= [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ];

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

                    results.dataset[0].backgroundColor= [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ];

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
