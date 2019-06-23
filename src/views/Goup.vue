<template>
  <div>
    <Toolbar title="Envoi de fichier" icon="help" drawer/>
    <v-container>
      <v-layout>
        <v-flex xs6>
          <form ref="fileform">
              <span class="drop-files">Drop the files here!</span>
          </form>
          <v-btn @click="upload">upload</v-btn>
        </v-flex>
        <v-flex xs6>
          <div v-for="(file, key) in files" :key="key" class="file-listing">
            <img class="preview" v-bind:ref="'preview'+parseInt( key )"/>
            {{ file.name }}
            <div class="remove-container">
              <a class="remove" v-on:click="removeFile( key )">Remove</a>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Toolbar from '@/components/Toolbar.vue'
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
    file() {return this.files[0]},
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    // if( this.dragAndDropCapable ){
    //   ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
    //     this.$refs.fileform.addEventListener(evt, (e) => {
    //       e.preventDefault()
    //       e.stopPropagation()
    //     }).bind(this), false
    //   }).bind(this)
    //   this.$refs.fileform.addEventListener('drop', function(e) {
    //     for (f of e.dataTransfer.files) {
    //       this.files.push(f)
    //     }
    //   }.bind(this))
    // }
  },
  methods: {
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
    upload() {
      const self = this
      const metadata = {}
      Object.assign(metadata, this.localMetadata)
      Object.assign(metadata, {
        filename: this.file.name,
        filetype: this.file.type,
        private: self.privateFile ? 'true' : 'false',
      })

      const upload = new tus.Upload(this.file, {
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
  },
  components: { Toolbar },
  }
</script>

<style scoped>
  form{
    display: block;
    height: 300px;
    width: 300px;
    background: #ccc;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    line-height: 400px;
      border-radius: 4px;
  }
  div.file-listing{
    width: 400px;
    margin: auto;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  div.file-listing img{
    height: 100px;
  }
</style>