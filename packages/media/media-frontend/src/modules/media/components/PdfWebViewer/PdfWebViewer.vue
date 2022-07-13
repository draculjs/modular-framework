<template>
  <div id="app" class="pdfViewer">
    <div class="app-header">
      <template v-if="isLoading">
        Loading...
      </template>

      <template v-else>

        <span class="d-flex">
          <v-spacer/>
          <button :disabled="page <= 1" @click="page--">❮</button>
          <v-spacer/>
          {{ page }} / {{ totalPages }}
          <v-spacer/>
          <button :disabled="page >= totalPages" @click="page++">❯</button>
          <v-spacer/>

        </span>
      </template>
    </div>

    <v-card height="100%" flat>
      <v-spacer/>
        <vue-pdf-embed
          ref="pdfRef"
          :source="pdfSource"
          :page="page"
          @rendered="handleDocumentRender"
        />
    </v-card>
  </div>
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import { mapGetters } from 'vuex'

export default {
    name: "PdfWebViewer",
    components: {
        VuePdfEmbed,
    },

    props: ['url', 'width'],

    data() {
        return {
            pdfSource: Buffer.from(this.url, 'base64').toString("utf-8"),
            page: 1,
            totalPages: null,
            isLoading : true,
        }
    },
    computed: {
      ...mapGetters([
        'me'
      ]),
    },
    mounted() {
      this.avoidPrint()
    },
    methods: {
      handleDocumentRender() {
        this.isLoading = false
        this.totalPages = this.$refs.pdfRef.pageCount
      },
      avoidPrint() {
        if (!this.me.role.permissions.includes('FILE_SHOW_OWN')) {
          window.onbeforeprint = () => {
            let url = window.location.href
            window.location.href = url
            alert("No tiene permisos para imprimir")
          }
        }
      },
    },

}
</script>