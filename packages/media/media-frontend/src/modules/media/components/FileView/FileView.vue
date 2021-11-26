<template>
  <v-row dense>

    <v-col cols="12" sm="6">
      <v-img v-if="isImage" contain :src="getSrc"/>

      <audio v-if="isAudio" controls>
        <source :src="getSrc" :type="file.mimetype">
        Your browser does not support the audio element.
      </audio>

      <video  v-if="isVideo" width="100%" controls>
        <source :src="getSrc" :type="file.mimetype">
      </video>

      <object v-if="isPdf"
              :data="getSrc"
              type="application/pdf" width="300"
              height="200"
      >
        <a :href="getSrc" target="_blank" class="text-uppercase"> {{$t('media.file.download')}}</a>
      </object>

      <a v-if="!isImage && !isAudio && !isVideo && !isPdf" target="_blank" :href="getSrc" class="text-uppercase">
            {{$t('media.file.download')}}
      </a>
    </v-col>

    <v-col cols="12" sm="6">
      <show-field :value="file.filename" :label="$t('media.file.filename')" icon="description"/>
      <show-field :value="file.id" :label="$t('media.file.id')" icon="badge"/>
      <show-field :value="file.mimetype" :label="$t('media.file.mimetype')" icon="category"/>
      <show-field :value="getSizeInMegaBytes" :label="$t('media.file.size')" icon="line_weight"/>

      <v-list-item>
        <v-list-item-icon class="mr-5">
          <v-btn small icon @click="copyToClipboard">
            <v-icon>content_copy</v-icon>
          </v-btn>
          <input type="hidden" id="url" :value="file.url">
        </v-list-item-icon>

        <v-list-item-content class="mr-0">
          <span>{{ file.url }} <v-btn x-small icon color="blue" target="_blank" :href="file.url"><v-icon>launch</v-icon></v-btn></span>

        </v-list-item-content>
      </v-list-item>
    </v-col>

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
</template>

<script>
import {ShowField} from '@dracul/common-frontend'

export default {
  name: "FileView",
  components: {ShowField},
  props: {
    file: {type: Object}
  },
  data() {
    return {
      copyResult: false,
      copyText: 'Copy to clipboard'
    }
  },
  computed: {
    isImage() {
      return (this.file && this.file.type === 'image') ? true : false
    },
    isAudio() {
      return (this.file && this.file.type === 'audio') ? true : false
    },
    isVideo() {
      return (this.file && this.file.type === 'video') ? true : false
    },
    isPdf() {
      return (this.file && this.file.mimetype === 'application/pdf') ? true : false
    },
    getSrc() {
      if (this.file && this.file.url) {
        return this.file.url
      }
      return null
    },
    getSizeInMegaBytes() {
      return this.file.size.toFixed(5) + ' Megabyte'
    }
  },
  methods: {
    copyToClipboard() {
      let toCopy = document.querySelector('#url')
      toCopy.setAttribute('type', 'text')
      toCopy.select()

      try {
        this.copyResult = document.execCommand('copy');
      } catch (err) {
        alert('Oops, unable to copy');
      }

      /* unselect the range */
      toCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },

  }
}
</script>

<style scoped>

</style>
