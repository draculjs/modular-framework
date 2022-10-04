<template>
    <div>
        <v-data-table
            target="_blank" 
            class="pt-0 mt-0 tableContainer"
            :headers="headers"
            :items="content.data"
            hide-default-footer>
        </v-data-table>
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
            snackbarTimeOut: 3000
        }
    },
    methods: {
        parseFileCsv(){
            Papa.parse(this.url,{
                download: true,
                delimiter: "",
                preview: 5,
                header: true,
                complete: function( results ){
                    if(results.errors.length == 0){
                        this.content = results;
                        this.content.meta.fields.forEach(elem => {
                            let item = { text: elem, value: elem.toLowerCase()}
                            this.headers.push(item)
                        })
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