<template>
    <div>
        <v-data-table
            class="mx-auto"
            :headers="headers"
            :items="content"
            :items-per-page="5"
            :no-data-text="noDataText"
        ></v-data-table>
        <Snackbar
            v-model="snackbarMessage"
            :color="snackbarColor"
            :timeout="snackbarTimeOut"
            v-on:closeSnackbar="snackbarMessage = null"
        />
    </div>
</template>

<script>
import Snackbar from "@dracul/common-frontend/src/components/Snackbar/Snackbar";
import Papa from 'papaparse';

export default {
    name: "CsvWebViewer",
    components: { Snackbar },
    props: {
        url: {type: String}
    },
    data(){
        return {
            headers: [],
            content: [],
            snackbarColor: "",
            snackbarMessage:"",
            snackbarTimeOut: 3000,
            noDataText: "No se pudo procesar la información del csv. Por favor intente nuevamente más tarde!"
        }
    },
    methods: {
        parseFileCsv(){
            Papa.parse(this.url,{
                download: true,
                delimiter: "",
                preview: 5,
                header: true,
                skipEmptyLines: true,
                complete: function( results ){
                    if(results.errors.length == 0){
                        results.meta.fields.forEach(elem => {
                            let item = { text: elem, value: elem}
                            this.headers.push(item)
                        })
                        this.content = results.data
                    } else {
                        this.snackbarColor = "error";
                        this.snackbarMessage = this.$t("media.file.errorCsvMessage");
                        console.log("Error al parsear el archivo csv, error: ", results.errors[0]);
                    }
                }.bind(this)
            })
        }
    },
    mounted() {
        this.parseFileCsv()
    }
}
</script>

<style>
    .tableContainer{
        max-height: 50vh;
    }
</style>