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
              <v-btn flat color="red darken-2" @click="files=[]" :disabled="files.length == 0">vider la liste</v-btn>
              <v-btn flat color="green darken-2" :disabled="files.length == 0" @click="upload">Procéder à l'envoi</v-btn>
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
      jwt() {return this.$store.getters.jwt},
      token() {return this.$store.state.token},
    },
    upload() {},
    mounted() {
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
            this.files.push({file: f})
          }
        }).bind(this))

        this.$refs.uploadForm.addEventListener('change', ((e) => {
          for (const f of e.target.files){
            this.files.push({file: f})
          }
        }).bind(this))
      }
    },
    methods: {
      uploadFiles() {
        for (fileID in this.files) {
          if (!this.files[fileID].completed) {

          }
        }
      },
      uploadObject(file) {
        Object.assign(metadata, {
          filename: this.file.name,
          filetype: this.file.type,
          private: self.privateFile ? 'true' : 'false',
        })

        const upload = new tus.Upload(this.file, {
          endpoint: '/files/',
          retryDelays: [0, 3000, 5000, 10000, 20000],
          metadata,
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
          chunkSize: 4000000,

          onError(error) {
            self.journal =
              self.date() + ': Echec -> ' + error + '\n' + self.journal
            self.Progress = 0
            self.uploading = false
          },

          onProgress(bytesUploaded, bytesTotal) {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
            self.progress = parseInt(percentage, 10)
            self.journal =
              self.date() +
              ': Envoi en cours -> ' +
              BytesUploaded +
              ' sur ' +
              bytesTotal +
              ', soit ' +
              percentage +
              '%\n' +
              self.journal
          },
          onSuccess() {
            self.journal =
              self.date() +
              ': Envoi effectué -> ' +
              upload.file.name +
              '\n' +
              self.journal
            self.Progress = 0
            self.uploading = false
          },
        })

        this.uploading = true
        upload.start()
      },
      handleFileSelect(e) {
        if(!e.target.files) return;      
        e.target.files.forEach((f) => {
          this.files.push(f)
        })
      },
      triggerForm() {
        this.$refs.uploadForm.click()
      },
      print() {
        console.log(this.$localStore.state.files)
      },
      date() {
        let today = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1
        const yyyy = today.getFullYear()
        let hh = today.getHours()
        let mn = today.getMinutes()
        const ss = today.getSeconds()
        let ms = today.getMilliseconds()

        if (dd < 10) {
          dd = '0' + dd
        }

        if (mm < 10) {
          mm = '0' + mm
        }

        if (hh < 10) {
          hh = '0' + hh
        }
        if (mn < 10) {
          mn = '0' + mn
        }

        if (ss < 10) {
          mn = '0' + mn
        }

        if (ms < 100) {
          ms = '0' + ms
        }
        if (ms < 10) {
          ms = '0' + ms
        }
        today =
          yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn + ':' + ss + '.' + ms
        return today
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