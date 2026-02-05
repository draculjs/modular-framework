<template>
  <v-btn icon x-small class="mx-1" @click="dialog = true">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="primary" v-bind="attrs" v-on="on">mdi-note-edit</v-icon>
      </template>
      <span>Editar archivo</span>
    </v-tooltip>

    <v-dialog v-if="dialog" v-model="dialog" max-width="80vw" persistent>
      <v-card style="max-height: 80vh; display: flex; flex-direction: column">
        <v-toolbar color="primary" dark>
          <v-toolbar-title class="mt-3">
            Editar archivo
            <v-subheader class="mt-n5 pa-0">{{ file.filename }}</v-subheader>
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="flex-grow-1 overflow-y-auto pa-4" style="min-height: 0">
          <div class="d-flex mb-2 justify-end">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn small icon @click="copyToClipboard" :disabled="!noteContent">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </span>
              </template>
              <span>Copiar</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn small icon @click="clearContent" class="ml-2" :disabled="!noteContent">
                    <v-icon>mdi-backspace-outline</v-icon>
                  </v-btn>
                </span>
              </template>
              <span>Limpiar</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn small icon @click="undoAction" class="ml-2" :disabled="undoStack.length === 0">
                    <v-icon>mdi-undo</v-icon>
                  </v-btn>
                </span>
              </template>
              <span>Deshacer</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn small icon @click="redoAction" class="ml-2" :disabled="redoStack.length === 0">
                    <v-icon>mdi-redo</v-icon>
                  </v-btn>
                </span>
              </template>
              <span>Rehacer</span>
            </v-tooltip>

            <v-spacer />

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn small icon @click="toggleFormat" :disabled="!isJson">
                    <v-icon>{{ isFormatted ? 'mdi-format-letter-case' : 'mdi-format-align-left' }}</v-icon>
                  </v-btn>
                </span>
              </template>
              <span>{{ isFormatted ? 'Minificar JSON' : 'Formatear JSON' }}</span>
            </v-tooltip>
          </div>

          <div
              ref="editor"
              class="json-editor"
              :class="{ 'json-editor-error': hasErrors }"
              contenteditable
              spellcheck="false"
              autocorrect="off"
              autocomplete="off"
              autocapitalize="off"
              @input="onEdit"
              @blur="onBlur"
          ></div>

          <div v-if="hasErrors" class="error-message">
            {{ errorMessages[0] }}
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false" :disabled="loading">{{ $t('common.cancel') }}</v-btn>
          <v-btn :disabled="hasErrors || loading" color="primary" @click="saveNote" :loading="loading">
            {{ $t('common.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import { FileProvider } from '@dracul/media-frontend'

export default {
  props: { file: Object },
  data() {
    return {
      dialog: false,
      noteContent: '',
      originalContent: '',
      isFormatted: false,
      loading: false,
      errorMessages: [],
      undoStack: [],
      redoStack: []
    }
  },
  computed: {
    hasErrors() {
      return this.errorMessages.length > 0
    },
    isJson() {
      return this.file.extension === '.json' && this.noteContent.trim() !== ''
    }
  },
  // async beforeMount() {
  //   await this.loadFileText()
  // },
  methods: {
    // === MÉTODO MODIFICADO ===
    async loadFileText() {
      try {
        // 1. Obtener el token igual que en FileView.vue
        const authToken = this.$store.state.user.access_token

        if (!this.file.url) throw new Error("File URL is missing")

        // 2. Configurar headers y cache
        const requestOptions = {
          method: 'GET',
          cache: 'no-store',
          headers: {}
        }

        // 3. Inyectar Authorization si existe el token
        if (authToken) {
          requestOptions.headers['Authorization'] = `Bearer ${authToken}`
        }

        // 4. Realizar el fetch
        const response = await fetch(this.file.url, requestOptions)

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        this.noteContent = await response.text()
        this.originalContent = this.noteContent
        this.isFormatted = false
        this.undoStack = []
        this.redoStack = []
        this.validateJson()
        this.renderEditor()
      } catch (error) {
        console.error('Failed to load content:', error)
        this.noteContent = ''
        // Mostramos el mensaje de error real para saber si es 401, 404, etc.
        this.errorMessages = [`Error cargando el contenido: ${error.message}`]
      }
    },
    validateJson() {
      this.errorMessages = []
      if (this.isJson) {
        try {
          JSON.parse(this.noteContent)
        } catch {
          this.errorMessages = ['Formato JSON inválido']
        }
      }
    },
    toggleFormat() {
      this.pushUndo()
      if (!this.isFormatted) {
        this.originalContent = this.noteContent
        const obj = JSON.parse(this.noteContent)
        this.noteContent = JSON.stringify(obj, null, 2)
      } else {
        this.noteContent = this.originalContent
      }
      this.isFormatted = !this.isFormatted
      this.validateJson()
      this.renderEditor()
    },
    onEdit() {
      this.pushUndo()
      this.noteContent = this.$refs.editor.innerText
      this.originalContent = this.noteContent
      this.isFormatted = false
      this.validateJson()
    },
    onBlur() {
      this.renderEditor()
    },
    pushUndo() {
      this.undoStack.push(this.noteContent)
      this.redoStack = []
    },
    undoAction() {
      if (!this.undoStack.length) return
      this.redoStack.push(this.noteContent)
      const prev = this.undoStack.pop()
      this.noteContent = prev
      this.validateJson()
      this.renderEditor()
    },
    redoAction() {
      if (!this.redoStack.length) return
      this.undoStack.push(this.noteContent)
      const next = this.redoStack.pop()
      this.noteContent = next
      this.validateJson()
      this.renderEditor()
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.noteContent)
    },
    clearContent() {
      this.pushUndo()
      this.noteContent = ''
      this.validateJson()
      this.renderEditor()
    },
    renderEditor() {
      if (!this.$refs.editor) return
      const text = this.noteContent
      let html = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"\s*?)(?=:)/g, '<span class="json-key">$1</span>')
          .replace(/(:\s*)("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, '$1<span class="json-string">$2</span>')
          .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
      this.$refs.editor.innerHTML = html
    },
    async saveNote() {
      if (this.hasErrors) return
      this.loading = true
      try {
        const blob = new Blob([this.noteContent], { type: 'application/json' })
        const newFile = new File([blob], this.file.filename, { type: 'application/json', lastModified: Date.now() })
        const input = {
          id: this.file.id,
          description: this.file.description || '',
          tags: this.file.tags || [],
          expirationDate: this.file.expirationDate || null,
          isPublic: this.file.isPublic || false,
          groups: this.file.groups || [],
          users: this.file.users || []
        }
        const result = await FileProvider.updateFile(input, newFile)
        if (result?.data?.fileUpdate) {
          this.dialog = false
          this.$emit('file-updated', result.data.fileUpdate)
        }
        this.$emit('itemUpdated')
      } catch (error) {
        console.error('Error guardando archivo:', error)
        this.errorMessages = ['Error guardando el archivo']
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    dialog: async function (open) {
      if (open) {
        this.errorMessages = []
        await this.loadFileText()
      }
    }
  }
}
</script>

<style>
.json-editor {
  background: #2e2e2e;
  color: #ccc;
  white-space: pre-wrap;
  font-family: monospace;
  outline: none;
  min-height: 200px;
  padding: 8px;
  border-radius: 2px;
}
.json-key { color: #c5a5c5; }
.json-string { color: #8dc891; }
.json-number { color: #f99157; }

.json-editor-error {
  border: 1px solid #ff5252;
  background-color: #2e2e2e;
}
.error-message {
  color: #ff5252;
  font-size: 0.875rem;
  margin-top: 4px;
}
</style>