<template>
  <v-dialog
    v-model="dialog"
    width="70%">
    <template v-slot:activator="{on, attrs}">
      <v-btn
        bottom
        class="mr-5 mb-3"
        color="green darken-2"
        dark
        fab
        large
        fixed
        right
        v-bind="attrs"
        v-on="on"
      >
        <v-icon style="top:-1px">far fa-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <div style="width: 100%; font-size: 17px; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="green darken-2" dark>
          <v-toolbar-title class="localtoolbar">
            J'ajoute des établissements à contacter
          </v-toolbar-title>
        </v-toolbar>
        <v-card class="pl-2 pr-2">
          <v-card-text class="pb-0 mb-0 pt-6 mt-0">
            <h2 class="mb-3">Insérez la liste des codes sirets que vous souhaitez ajouter dans la zone de texte: </h2>
            <v-textarea
              v-model="addPendingText"
              :placeholder="placeholder"
              no-resize
              solo
              width="30"
            />
          </v-card-text>
          <v-card-text>
            <h2 v-if="checkedSirets.length>0" class="mb-3">{{ checkedSirets.length }} code{{ checkedS }} SIRET détectés et analysés</h2>
            <v-layout wrap>
              <v-flex v-if="validSirets.length>0" class="pr-5 pl-5" md3 xs6>
                <h2 class="pb-2" style="color: darkgreen">Valides ({{ validSirets.length }})</h2>
                <ul class="scrollable" style="border-left-color: darkgreen">
                  <li v-for="item in validSirets" :id="item.siret">
                    <span style="font-size: 18px">{{ item.raisonSociale }}</span><br/>
                    {{ item.siret }}
                  </li>
                </ul>
              </v-flex>
              <v-flex v-if="presentSirets.length>0" class="pr-5 pl-5" md3 xs6>
                <h2 class="pb-2" style="color: darkblue;">Déjà présents ({{ presentSirets.length }})</h2>
                <ul class="scrollable" style="border-left-color: darkblue">
                  <li v-for="item in presentSirets" :id="item.siret">
                    <span style="font-size: 18px">{{ item.raisonSociale }}</span><br/>
                    {{ item.siret }}
                  </li>
                </ul>
              </v-flex>
              <v-flex v-if="horsZoneSirets.length>0" class="pr-5 pl-5" md3 xs6>
                <h2 class="pb-2" style="color: darkred;">Hors territoire ({{horsZoneSirets.length}})</h2>
                <ul class="scrollable" style="border-left-color: darkred">
                  <li v-for="item in horsZoneSirets" :id="item.siret">
                    <span style="font-size: 18px">{{ item.raisonSociale }}</span><br/>
                    {{ item.siret }}
                  </li>
                </ul>
              </v-flex>
              <v-flex v-if="nonSirets.length>0" class="pr-5 pl-5" md3 xs6>
                <h2 class="pb-2" style="color: darkgrey;">Inexistants</h2>
                <ul class="scrollable" style="border-left-color: darkgrey">
                  <li style="color: darkgrey" v-for="item in nonSirets" :id="item.siret">
                    <span style="font-size: 18px;">N/C</span><br/>
                    {{ item.siret }}
                  </li>
                </ul>
              </v-flex>
            </v-layout>
            <div class="pt-8" style="text-align: right">
              <v-btn class="mr-4" color="indigo" dark outlined @click="hide">
                RETOUR
              </v-btn>
              <v-btn :color="(validSirets.length>0)?'indigo':null"
                     :dark="validSirets.length>0"
                     :disabled="validSirets.length==0" @click="addSirets">
                AJOUTER {{(validSirets.length>0)?'('+validSirets.length+')':''}}
              </v-btn>
            </div>
            <div class="mt-5" v-if="alertAdd || alertCheck">
            <v-alert
              v-if="alertAdd"
              border="left"
              prominent
              type="error">
              Un problème est survenu lors de l'ajout des établissements
            </v-alert>
            <v-alert
              v-if="alertCheck"
              border="left"
              prominent
              type="error">
              Un problème est survenu lors de l'analyse des établissements
            </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-dialog>
</template>

<script>
import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsPendingActionsAddPendingDialog",
  data() {
    return {
      dialog: false,
      addPendingText: null,
      checkedSirets: [],
      debounceTimer: null,
      alertCheck: false,
      alertAdd: false,
      placeholder: "exemple:\n" +
        "45370330800016 82529411900011\n" +
        "499425957 00028;422087106 00015\n" +
        "39094352000010,88909757200016,45097300300020"
    }
  },
  setup() {
    const campaigns = useCampaignsStore()
    return {campaigns}
  },
  watch: {
    addPendingText() {
      this.checkSirets()
    },
  },
  computed: {
    addPendingTextSirets() {
      const reSirets = /([0-9]{14})|([0-9]{9}\w[0-9]{5})/g
      const sirets = (this.addPendingText || '').match(reSirets)
      return sirets || []
    },
    validSirets() {
      return this.checkedSirets.filter((s) => s.status === 'ok')
    },
    nonSirets() {
      return this.checkedSirets.filter((s) => s.status === 'nonSiret')
    },
    horsZoneSirets() {
      return this.checkedSirets.filter((s) => s.status === 'horsZone')
    },
    presentSirets() {
      return this.checkedSirets.filter((s) => s.status === 'present')
    },
    checkedS() {
      return (this.checkedSirets.length > 1) ? 's' : ''
    },
    validS() {
      return (this.validSirets.lenth > 0) ? 's' : ''
    },
    params() {
      return {
        sirets: this.addPendingTextSirets
      }
    }
  },
  methods: {
    hide() {
      this.dialog = false
    },
    addSirets() {
      this.$axios.post("/campaign/addsirets/" + this.campaigns.selectedID, this.params)
        .then((r) => {
          this.dialog = false
        }).catch((err) => {
        this.alertAdd = true
      })
    },
    checkSirets() {
      if (this.addPendingTextSirets.length == 0) {
        this.checkedSirets = []
        return
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        const params = {
          sirets: this.addPendingTextSirets
        }
        this.$axios.post("/campaign/checksirets/" + this.campaigns.selectedID, params)
          .then((r) => {
            this.checkedSirets = r.data.sirets
          }).catch((r) => {
          this.checkedSirets = []
          this.alertCheck = true
        })
      }, 400)
    }
  }
}
</script>

<style>
.scrollable {
  border-left-style: solid;
  border-left-width: 2px;
  height: 200px;
  overflow-y: scroll;
}

</style>