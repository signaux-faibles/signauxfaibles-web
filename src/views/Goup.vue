<template>
  <div>
    <Toolbar title="Envoi de fichier" icon="help" drawer/>
    <v-container>
      <v-layout wrap>
        <v-flex xs5>
          <form id="fileform" ref="fileform" class="card elevation-2">
            <div id="dropfiles">
              <v-icon color="indigo darken-4" style="font-size: 200px; text-shadow: 0px 2px 3px grey;">cloud_upload</v-icon><br/>
              <span>Déposez vos fichiers ici ou</span><br/>
              <v-btn round dark color="indigo darken-4" @click="triggerForm">sélectionnez les fichiers</v-btn>
              <input 
                ref="uploadForm" 
                type="file" 
                id="uploadForm" 
                class="browse" 
                multiple>
            </div>
          </form>
        </v-flex>
        <v-flex xs7>
          <v-card class="card">
            <v-card-title class="headline">Fichiers sélectionnés</v-card-title>
            <v-card-text >
              <v-list style="background:#fff0;">
               <Upload v-for="(file, key) in files" :files="files" :fileId="key" :key="key"/>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn flat color="red darken-2" @click="files=[]" :disabled="files.length == 0 || uploading || error">vider la liste</v-btn>
              <v-btn v-if="!uploading" style="width: 250px" flat :color="paused ? 'indigo darken-2' : 'green darken-2'" :disabled="files.length == 0 || error" @click="runUpload">
                <v-icon>play_arrow</v-icon>
                {{ paused ? 'Reprendre' : 'Procéder à' }} l'envoi
              </v-btn>
              <v-btn v-if="uploading" style="width: 250px" flat color="indigo darken-2" :disabled="files.length == 0 || error" @click="stopUpload">
                <v-icon>pause</v-icon>
                Interrompre l'envoi
              </v-btn> 
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex style="margin: 70px; text-align: center" xs12>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Toolbar from '@/components/Toolbar.vue'
  import Upload from '@/components/Upload.vue'
  import tus from 'tus-js-client'

  export default {
    data() {
      return {
        dragAndDropCapable: false,
        files: [],
      }
    },
    computed: {
      jwt() {return this.$keycloak.tokenParsed},
      token() {return this.$keycloak.token},
      header() {
        return {
            Authorization: 'Bearer ' + this.$keycloak.token,
          }
      },
      uploading() {
        return this.files.some((f) => f.uploading)
      },
      error() {
        return this.files.some((f) => f.error)
      },
      paused() {
        return this.files.some((f) => f.paused)
      },
    },
    mounted() {
      this.$store.dispatch('refreshSession')

      this.dragAndDropCapable = this.determineDragAndDropCapable()
      if (this.dragAndDropCapable) {
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( ((evt) => {
          this.$refs.fileform.addEventListener(evt, ((e) => {
            e.preventDefault()
            e.stopPropagation()
          }).bind(this), false)
        }).bind(this))

        this.$refs.fileform.addEventListener('drop', ((e) => {
          for (const f of e.dataTransfer.files) {
            this.files.push(this.uploadObject(f))
          }
        }).bind(this))

        this.$refs.uploadForm.addEventListener('change', ((e) => {
          for (const f of e.target.files) {
            this.files.push(this.uploadObject(f))
          }
        }).bind(this))
      }
    },
    methods: {

      uploadObject(file) {
        const self = this

        const object = {
          file,
          private: false,
          error: false,
          progress: 0,
          completed: false,
          uploading: false,
          retries: 10,
          paused: false,
        }

        const upload = new tus.Upload(file, {
          endpoint: '/files/',
          resume: true,
          metadata: {
            filename: file.name,
            filetype: file.type,
            private: true,
          },
          headers: this.header,
          overridePatchMethod: true,
          chunkSize: 1048576,
          onError(error) {
            object.error = true
            object.uploading = false

            if (object.retries > 0) {
              object.retries += -1
              window.setTimeout(self.runUpload, 200)
            }
          },

          onProgress(bytesUploaded, bytesTotal) {
            object.progress = parseInt(((bytesUploaded / bytesTotal) * 100).toFixed(0), 10)
          },

          onChunkComplete() {
            object.retries = 10
            object.error = false
          },

          onSuccess() {
            object.progress = 100
            object.uploading = false
            object.completed = true
            self.runUpload()
          },
        })
        object.upload = upload
        return object
      },

      updateToken() {
        for (const object of this.files) {
          object.upload.options.headers = {
              Authorization: 'Bearer ' + this.token,
            }
        }
      },
      runUpload() {
        this.updateToken()
        for (const i in this.files) {
          if (this.files[i].completed === false) {
            // this.files[i].error = false
            this.files[i].paused = false
            this.files[i].uploading = true
            this.files[i].upload.start()
            break
          }
        }
      },
      stopUpload() {
        this.updateToken()
        this.files.forEach((file) => {
          files.upload.abort()
          files.uploading = false
          files.paused = true
          files.error = false
        })
      },
      handleFileSelect(e) {
        if (!e.target.files) {
          return
        }
        e.target.files.forEach((f) => {
          this.files.push(f)
        })
      },
      triggerForm() {
        this.$refs.uploadForm.click()
      },
      determineDragAndDropCapable() {
        const div = document.createElement('div')

        return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window
      },
      removeFile(key) {
        this.files.splice( key, 1 )
      },
    },
    components: { Toolbar, Upload },
  }
</script>

<style scoped>
  #uploadForm {
      position: absolute;
      margin-top: 3px;
      margin-left: 3px;
      height: 1px;
      width: 1px;
      z-index: -5;
      visibility: hidden;
  }

  .card {
    background: radial-gradient(
      ellipse at center,
      rgb(255, 255, 255),
      #e2dfe9 85%,
      #cecece 100%,
      transparent
    );
        border-radius: 2px;
    border: 2px solid #bbc;
  }

  .v-list {
    height: 198px;
    overflow-y: auto;
  }

  #fileform{
    display: block;
    height: 350px;
    width: 350px;
    line-height: 35px;
    margin: auto;
    text-align: center;
  }

  #dropfiles {
    height: 300px;
    color: #666;
    font-size: 40px;
  }

  div.file-listing{
    vertical-align: middle;
    width: 400px;
    margin: auto;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  div.file-listing img{
    height: 100px;
  }
</style>