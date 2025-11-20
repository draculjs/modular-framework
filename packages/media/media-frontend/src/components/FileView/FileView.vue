<template>
  <v-container v-if="file" class="pt-0 mt-0 mainContainer">
    <v-tabs v-model="activeTab" fixed-tabs class="pb-5">
      <v-tab key="previewTab">Previsualización</v-tab>
      <v-tab key="metadataTab">Metadata</v-tab>
      <v-tab key="privacyTab">Privacidad</v-tab>
      <v-tab key="fileHistoryTab">Historial</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab" fill-height>
      <v-tab-item>
        <div v-if="!isImage && !isAudio && !isVideo && !isPdf">
          <csv-web-viewer v-if="isCsv && fileObjectUrl" :url="fileObjectUrl"></csv-web-viewer>
          <xlsx-web-viewer v-if="isXlsx && fileObjectUrl" :url="fileObjectUrl"></xlsx-web-viewer>
          <v-btn block v-if="$store.getters.hasPermission('FILE_DOWNLOAD')" @click="downloadFile" class="text-uppercase mb-2" title color="success">
            <v-icon left>mdi-arrow-down-bold-circle</v-icon>
            {{ $t('media.file.download') }}
          </v-btn>
        </div>

        <v-img v-if="isImage && fileObjectUrl" :src="fileObjectUrl" width="100%"></v-img>

        <audio v-if="isAudio && fileObjectUrl" controls :src="fileObjectUrl" :type="file.mimetype" width="100%"></audio>

        <video v-if="isVideo && fileObjectUrl" width="100%" controls :src="fileObjectUrl" :type="file.mimetype"></video>

        <v-container fluid>
          <v-alert v-if="hasFileLoadingError" type="error" dense>
            Error al cargar el archivo (CORS o permisos).
          </v-alert>
          <pdf-web-viewer v-if="isPdf && fileObjectUrl" :url="fileObjectUrl" style="max-height: 50vh; overflow: auto;"></pdf-web-viewer>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-row dense>
          <show-field :value="file.id" :label="$t('media.file.id')" icon="badge"/>
          <show-field :value="file.filename" :label="$t('media.file.filename')" icon="short_text"/>
          <show-field :value="file.description" :label="$t('media.file.description')" icon="description"/>
          <show-field :value="file.mimetype" :label="$t('media.file.mimetype')" icon="category"/>
          <show-field :value="getSizeInMegaBytes" :label="$t('media.file.size')" icon="line_weight"/>
          <show-chip-field :chips="file.tags" :label="$t('media.file.tags')" icon="tag"/>
          <show-field :value="hits" :label="$t('media.file.hits')" icon="visibility"/>

          <v-list-item v-if="$store.getters.hasPermission('FILE_DOWNLOAD')">
            <v-list-item-icon class="mr-5">
              <v-btn small icon @click="copyToClipboard">
                <v-icon color="black">content_copy</v-icon>
              </v-btn>
              <input type="hidden" id="url" :value="file.url">
            </v-list-item-icon>
            <v-list-item-content class="mr-0">
              <span>{{ file.url }} <v-btn x-small icon color="blue" @click="openFileInNewTab"><v-icon>launch</v-icon></v-btn></span>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-else>
            <span v-if="isPdf">
              <v-icon color="black">mdi-book-open</v-icon>
              Abrir en nueva pestaña
              <v-btn x-small icon color="blue" @click="openFileInNewTab">
                <v-icon>launch</v-icon>
              </v-btn>
            </span>
          </v-list-item>

          <v-snackbar v-model="showClipboardSnackbar" timeout="2000">
            {{ clipboardSnackbarText }}
            <template v-slot:action="{ attrs }">
              <v-btn color="pink" text v-bind="attrs" @click="showClipboardSnackbar = false">
                <v-icon>close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-row>
      </v-tab-item>

      <v-tab-item>
        <show-field :value="isPublic" label="Privacidad del archivo" icon="mdi-cctv"/>
        <groups-show v-if="$store.getters.hasPermission('SECURITY_GROUP_SHOW')" :fileIdGroups="file.groups"></groups-show>
        <users-show v-if="$store.getters.hasPermission('SECURITY_USER_SHOW')" :fileIdUsers="file.users"></users-show>
      </v-tab-item>

      <v-tab-item>
        <v-data-table
            :headers="[{text: 'Fecha de modificacion del fichero', value: 'date', sortable: true, align: 'center'}, {text: 'Usuario', value: 'username', sortable: true, align: 'center'}]"
            :items="file.fileReplaces"
            :items-per-page="5"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
            class="elevation-1"
        ></v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { ShowField, ShowChipField } from '@dracul/common-frontend'
import { DayjsMixin } from '@dracul/dayjs-frontend'
import PdfWebViewer from '../PdfWebViewer'
import GroupsShow from '../GroupsShow'
import UsersShow from '../UsersShow'
import CsvWebViewer from '../CsvWebViewer'
import XlsxWebViewer from '../XlsxWebViewer'

export default {
  name: "FileView",
  components: { ShowField, ShowChipField, PdfWebViewer, GroupsShow, UsersShow, CsvWebViewer, XlsxWebViewer },
  props: {
    file: { type: Object }
  },
  mixins: [DayjsMixin],
  data() {
    return {
      showClipboardSnackbar: false,
      clipboardSnackbarText: '',
      activeTab: null,
      fileObjectUrl: null,
      isFileLoading: false,
      hasFileLoadingError: false
    }
  },
  mounted() {
    if (this.file && this.file.fileReplaces && this.file.fileReplaces.length > 0) {
      this.file.fileReplaces.forEach(historyItem => historyItem.date = this.getDateTimeFormat(historyItem.date, true))
    }
    this.loadFileAsBlob()
  },
  beforeUnmount() {
    this.revokeFileUrl()
  },
  watch: {
    'file.url'(newUrl, oldUrl) {
      if (newUrl !== oldUrl) this.loadFileAsBlob()
    }
  },
  computed: {
    isImage() {
      return (this.file && this.file.type === 'image')
    },
    isAudio() {
      return (this.file && this.file.type === 'audio')
    },
    isVideo() {
      return (this.file && this.file.type === 'video')
    },
    isPdf() {
      return (this.file && this.file.mimetype === 'application/pdf')
    },
    isCsv() {
      return (this.file && this.file.extension === ".csv")
    },
    isXlsx() {
      return (this.file && this.file.extension === ".xlsx")
    },
    getSizeInMegaBytes() {
      return this.file.size.toFixed(5) + ' MB'
    },
    hits() {
      return (this.file && String(this.file.hits))
    },
    isPublic() {
      return this.file.isPublic ? 'Público' : 'Privado'
    }
  },
  methods: {
    async fetchFileWithAuth(returnFullResponse = false) {
      const authToken = this.$store.state.user.access_token
      if (!authToken || !this.file.url) return null

      const response = await fetch(this.file.url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` },
        cache: 'no-store'
      })

      if (!response.ok) throw new Error(`Error fetching file: ${response.status} ${response.statusText}`)

      const blobData = await response.blob()
      const finalBlob = (blobData && blobData.type) ? blobData : new Blob([blobData], { type: (this.file.mimetype || 'application/octet-stream') })

      if (returnFullResponse) return { response, blob: finalBlob }
      return finalBlob
    },

    async loadFileAsBlob() {
      if (!this.file || !this.file.url) return

      this.isFileLoading = true
      this.hasFileLoadingError = false
      this.revokeFileUrl()

      try {
        const blob = await this.fetchFileWithAuth()
        if (!blob) {
          this.hasFileLoadingError = true
          return
        }
        this.fileObjectUrl = URL.createObjectURL(blob)
      } catch (error) {
        console.error("Error loading file as blob:", error)
        this.hasFileLoadingError = true
      } finally {
        this.isFileLoading = false
      }
    },

    revokeFileUrl() {
      if (this.fileObjectUrl) {
        URL.revokeObjectURL(this.fileObjectUrl)
        this.fileObjectUrl = null
      }
    },

    async downloadFile() {
      try {
        const { response, blob } = await this.fetchFileWithAuth(true)
        if (!response) return

        const contentDispositionHeader = response.headers.get('content-disposition') || ''
        const filenameFromHeader = this.extractFilenameFromContentDisposition(contentDispositionHeader)
        const filename = filenameFromHeader || this.file.filename || 'download'

        const objectUrl = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = objectUrl
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        setTimeout(() => URL.revokeObjectURL(objectUrl), 150)
      } catch (error) {
        console.error("Error downloading file:", error)
      }
    },

    extractFilenameFromContentDisposition(headerValue) {
      if (!headerValue) return null
      const match = headerValue.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i)
      if (!match) return null
      try {
        return decodeURIComponent(match[1].replace(/["']/g, ''))
      } catch (e) {
        return match[1].replace(/["']/g, '')
      }
    },

    async openFileInNewTab() {
      if (this.fileObjectUrl) {
        window.open(this.fileObjectUrl, '_blank')
        return;
      }

      try {
        const blob = await this.fetchFileWithAuth()
        if (blob) {
          const objectUrl = URL.createObjectURL(blob)
          window.open(objectUrl, '_blank')
        }
      } catch (error) {
        console.error("Could not open file in new tab:", error)
      }
    },

    async copyToClipboard() {
      const urlToCopy = this.file.url || ''
      try {
        await navigator.clipboard.writeText(urlToCopy)
        this.clipboardSnackbarText = 'URL copiada al portapapeles'
        this.showClipboardSnackbar = true
      } catch (error) {
        this.clipboardSnackbarText = 'Error al copiar la URL'
        this.showClipboardSnackbar = true
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }
}
</script>

<style scoped>
  .mainContainer {
    max-height: 65vh;
  }
</style>