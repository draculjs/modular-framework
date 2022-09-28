<template>

  <v-container class="pt-0 mt-0 mainContainer">
    <v-tabs
      v-model="tab"
      fixed-tabs
      class="pb-5"
    >
      <v-tab
        key="previewTab"
      >
        Previsualizacion
      </v-tab>

      <v-tab
        key="metadataTab"
      > 
        Metadata
      </v-tab>

      <v-tab
        key="privacyTab"
      >
       Privacidad 
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" fill-height>
        <v-tab-item> <!--preview-->
            <a v-if="!isImage && !isAudio && !isVideo && !isPdf && $store.getters.hasPermission('FILE_DOWNLOAD')" target="_blank" :href="getSrc" class="text-uppercase">
            {{ $t('media.file.download') }}
            </a>

            <img v-if="isImage" :style="{width: '100%'}" :src="getSrc"/>

            <audio v-if="isAudio" controls>
              <source :src="getSrc" :type="file.mimetype">
              Your browser does not support the audio element.
            </audio>

            <video v-if="isVideo" width="100%" controls>
              <source :src="getSrc" :type="file.mimetype"/>
            </video>

            <v-container fluid>
              <pdf-web-viewer
                v-if="isPdf"
                :url="bufferedURL"
                style="max-height: 50vh; overflow: auto;"
              ></pdf-web-viewer>
            </v-container>
        </v-tab-item>

        <v-tab-item><!--metadata-->
          <v-row dense>
            <show-field :value="file.filename" :label="$t('media.file.filename')" icon="description"/>
            <show-field :value="file.id" :label="$t('media.file.id')" icon="badge"/>
            <show-field :value="file.mimetype" :label="$t('media.file.mimetype')" icon="category"/>
            <show-field :value="getSizeInMegaBytes" :label="$t('media.file.size')" icon="line_weight"/>
            <show-field :value="file.tags ? file.tags.join(', ') : ''" :label="$t('media.file.tags')" icon="tag"/>

            <v-list-item v-if="$store.getters.hasPermission('FILE_DOWNLOAD')">
              <v-list-item-icon class="mr-5">
                <v-btn small icon @click="copyToClipboard">
                  <v-icon color="black">content_copy</v-icon>
                </v-btn>
                <input type="hidden" id="url" :value="file.url">
              </v-list-item-icon>
              <v-list-item-content class="mr-0">
                <span>{{ file.url }} <v-btn x-small icon color="blue" target="_blank" :href="file.url"><v-icon>launch</v-icon></v-btn></span>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-else>

              <span v-if="isPdf">
                <v-icon color="black">mdi-book-open</v-icon>
                Abrir en nueva pestaña
                <v-btn x-small icon color="blue"
                      target="_blank"
                      :href="`/pdf-viewer?url=${bufferedURL}`">
                  <v-icon>launch</v-icon>
                </v-btn>
              </span>
            </v-list-item>

          <v-snackbar
              v-model="copyResult" timeout="2000"
          >
            {{ copyText }}
            <template v-slot:action="{ attrs }">
              <v-btn
                  color="pink"
                  text
                  v-bind="attrs"
                  @click="copyResult = false"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-row>
        </v-tab-item>


        <v-tab-item><!--privacy-->
          <show-field :value="isPublic" label="Privacidad del archivo" icon="mdi-cctv"/>
          <show-field :value="hits" :label="$t('media.file.hits')" icon="visibility"/>
          <groups-show 
            v-if="$store.getters.hasPermission('SECURITY_GROUP_SHOW')" :fileIdGroups="file.groups"
            overflowX  
          >
          </groups-show>
          <users-show
            v-if="$store.getters.hasPermission('SECURITY_USER_SHOW')" :fileIdUsers="file.users"
            overflowX
          >
          </users-show>
        </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import {ShowField} from '@dracul/common-frontend'
import PdfWebViewer from '../PdfWebViewer'
import GroupsShow from '../GroupsShow'
import UsersShow from '../UsersShow'

export default {
  name: "FileView",
  components: { ShowField, PdfWebViewer, GroupsShow, UsersShow },
  props: {
    file: {type: Object}
  },
  data() {
    return {
      copyResult: false,
      copyText: 'Copy to clipboard',
      tab: null,
      jsonFile: []
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
    getSrc() {
      if (this.file && this.file.url) {
        console.log("FILEEE",this.jsonFile)

        return this.file.url
      }
      return null
    },
    getSizeInMegaBytes() {
      return this.file.size.toFixed(5) + ' Megabyte'
    },
    hits() {
      return (this.file && String(this.file.hits))
    },
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
    bufferedURL() {
      return new Buffer.from(this.file.url).toString('base64')
    },
    isPublic() {
      return this.file.isPublic ? 'Público' : 'Privado'
    }
  },
  methods: {
    getCsvToJson(url){
      this.$papa.parse(url,{
          download: true,
          delimiter: ";",
          preview: 5
          // rest of config ...
      }) 
    },
    copyToClipboard() {
      let toCopy = document.querySelector('#url')
      toCopy.setAttribute('type', 'text')
      toCopy.select()

      try {
        this.copyResult = document.execCommand('copy')
      } catch (err) {
        alert('Oops, unable to copy')
      }

      /* unselect the range */
      toCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('-')
      return `${day}/${month}/${year}`
    },

  },
  async mounted(){
    this.jsonFile = await this.getCsvToJson(this.file.url)
    console.log("FILE",this.jsonFile)
  }
}
</script>

<style scoped>
  .mainContainer{
    max-height: 65vh;
  }
</style>
