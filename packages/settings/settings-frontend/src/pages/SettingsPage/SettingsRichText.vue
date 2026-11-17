<template>
  <div class="settings-rich-text" v-html="renderedValue" />
</template>

<script>
import DOMPurify from 'dompurify'
import {marked} from 'marked'

export default {
  name: 'SettingsRichText',
  props: {
    value: {type: String, default: ''},
    type: {type: String, required: true}
  },
  computed: {
    renderedValue() {
      if (typeof window === 'undefined' || !DOMPurify.isSupported) return ''
      const value = this.value || ''
      const html = this.type === 'markdown' ? marked.parse(value, {async: false, gfm: true}) : value
      return DOMPurify.sanitize(html, {
        USE_PROFILES: {html: true},
        FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea']
      })
    }
  }
}
</script>

<style scoped>
.settings-rich-text { max-width: 100%; overflow-wrap: anywhere; overflow-x: auto; padding: 8px 0; }
.settings-rich-text ::v-deep img { max-width: 100%; }
.settings-rich-text ::v-deep pre { white-space: pre-wrap; }
.settings-rich-text ::v-deep table { border-collapse: collapse; }
.settings-rich-text ::v-deep th,
.settings-rich-text ::v-deep td { border: 1px solid rgba(127, 127, 127, .3); padding: 4px 8px; }
.settings-rich-text ::v-deep blockquote { border-left: 3px solid rgba(127, 127, 127, .3); padding-left: 12px; }
</style>
