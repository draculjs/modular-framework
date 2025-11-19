<template>
    <div>
        <v-data-table class="mx-auto elevation-1" height="50vh" fixed-header :hide-default-footer="!pagination"
            :items-per-page=10 :disable-pagination="!pagination" :headers="headers" :items="content"
            :no-data-text="noDataText"></v-data-table>
        <Snackbar v-model="snackbarMessage" :color="snackbarColor" :timeout="snackbarTimeOut"
            v-on:closeSnackbar="snackbarMessage = null" />
    </div>
</template>

<script>
import Snackbar from "@dracul/common-frontend/src/components/Snackbar/Snackbar";
import * as XLSX from "xlsx"

export default {
    name: "XlsxWebViewer",
    components: { Snackbar },
    props: {
        url: { type: String }
    },
    data() {
        return {
            headers: [],
            content: [],
            snackbarColor: "",
            snackbarMessage: "",
            snackbarTimeOut: 3000,
            noDataText: "No se pudo procesar la información del xlsx. Por favor intente nuevamente más tarde!"
        }
    },
    computed: {
        pagination() {
            return (this.content.length > 10) ?  true : false
        }
    },
    methods: {
        async parseFileXlsx() {
            try {
                const file = await fetch(this.url)
                const fileArrayBuffer = await file.arrayBuffer()

                const xlsxFile = XLSX.read(new Uint8Array(fileArrayBuffer, { type: 'array' }))
                const jsonSheets = XLSX.utils.sheet_to_json(xlsxFile.Sheets[xlsxFile.SheetNames[0]])

                if (jsonSheets.length < 0) {
                    this.noDataText = 'No existen datos en este registro'
                } else {
                    jsonSheets.forEach((element, index) => {
                        if (index === 0) {
                            Object.keys(element).forEach(key => {
                                let width = key?.length * 6

                                jsonSheets.forEach(data => {
                                    if (width < data[key]?.length * 6) width = data[key]?.length * 6
                                })

                                this.headers.push(
                                    {
                                        width,
                                        text: key,
                                        value: key,
                                        sortable: false
                                    }
                                )
                            })
                        }
                        this.content.push(element)
                    })
                }
            } catch (error) {
                this.noDataText = `Error al parsear el archivo xlsx, error: ${error}`
            }
        }
    },
    mounted() {
        this.parseFileXlsx()
    }
}
</script>