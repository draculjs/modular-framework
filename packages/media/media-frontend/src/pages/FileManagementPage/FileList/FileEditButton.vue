<template>
  <v-btn icon x-small class="mx-1" @click="dialog = true">
    <v-icon color="primary">mdi-note-edit</v-icon>
    
    <v-dialog v-if="dialog" v-model="dialog" max-width="80vw" persistent>
      <v-card style="max-height: 80vh; display: flex; flex-direction: column">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            Editar archivo
          </v-toolbar-title>
          <v-spacer/>
          <v-btn icon small @click="dialog = false" class="mr-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="flex-grow-1 overflow-y-auto pa-4" style="min-height: 0">
          <v-textarea
            v-model="noteContent"
            :label="file.filename"
            outlined
            auto-grow
            rows="3"
            :error-messages="errorMessages"
            :error="hasErrors"
            style="height: 100%"
            @input="validateJson"
          />
        </v-card-text>

        <v-divider/>

        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="dialog = false" :disabled="loading">{{ $t('common.cancel') }}</v-btn>
          <v-btn 
            :disabled="hasErrors || loading"
            color="primary" @click="saveNote" :loading="loading">{{ $t('common.update') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import FileProvider from "../../../providers/FileProvider"

export default {
    props:{
        file: Object,
    },
    data() {
      return {
        dialog: false,
        noteContent: '',
        loading: false,
        errorMessages: [],
      }
    },
    computed: {
        hasErrors() {
            return this.errorMessages.length > 0
        }
    },
    async beforeMount() {
        await this.loadFileText()
    },

    methods: {
        async loadFileText(){
      try {
        const response = await fetch(this.file.url)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        this.noteContent = await response.text()
        this.validateJson()
      } catch (error) {
        console.error('Failed to load content:', error)
        this.noteContent = ''
        this.errorMessages = ["Error cargando el contenido del archivo"]
      }
        },
      validateJson() {
        this.errorMessages = []
        
        if (this.file.extension === '.json' && this.noteContent.trim() !== '') {
          try {
            JSON.parse(this.noteContent)
          } catch (e) {
            this.errorMessages = ["Formato JSON inválido"]
          }
        }
      },
      
      async saveNote() {
        if (this.hasErrors) return
        
        this.loading = true
        
        try {
          const blob = new Blob([this.noteContent], { type: 'text/plain' })
          const newFile = new File([blob], this.file.filename, {
            type: 'text/plain',
            lastModified: Date.now()
          })
          
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
          
          if (result && result.data && result.data.fileUpdate) {
            this.dialog = false
            this.$emit('file-updated', result.data.fileUpdate)
          }

          this.$emit('itemUpdated')
        } catch (error) {
          console.error('Error guardando archivo:', error)
          this.errorMessages = ["Error guardando el archivo"]
        } finally {
          this.loading = false
        }
      }
    },
    watch:{
        dialog: async function(newVal){
            if (newVal){
                await this.loadFileText()
            }
        }
    }
}
</script>