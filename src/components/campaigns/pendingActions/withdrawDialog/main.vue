<template>
  <div>
    <v-dialog persistent v-model="withdrawDialog.visible" height=50% width=50%>
      <div style="width: 100%; font-size: 17px; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="red darken-3" dark>
          <v-toolbar-title class="localtoolbar">Je repousse cette prise de contact ({{ withdrawDialog.raisonSociale }})</v-toolbar-title>
        </v-toolbar>
        <v-card class="pl-2 pr-2 pb-2">
          <v-card-text class="pb-0 mb-0" style="font-size: 17px">
            Concernant cet établissement, je souhaite que cette demande de prise de contact soit:
          </v-card-text>
          <v-card-text class="pt-0 mt-0">
            <v-radio-group v-model="withdrawDialog.radio">
              <v-radio v-for="(label, value) in withdrawLabels" :key="value" :label="label" :value="value"/>
            </v-radio-group>
            <v-alert
              class="ml-4 mr-4 mt-0"
              dense
              colored-border
              type="info"

            >
              Dans l'immédiat, cette prise de contact sera déplacée en pied de liste.
            </v-alert>
            <div style="text-align: right">
              <v-btn class="mr-4" color="indigo" outlined dark @click="withdrawDialog.hide()">
                RETOUR
              </v-btn>
              <v-btn :color="(withdrawDialog.radio != null)?'indigo':null" :dark="withdrawDialog.radio != null"
                     :disabled="!withdrawDialog.radio" @click="withdraw">
                VALIDER
              </v-btn>
            </div>
          </v-card-text>

        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {useWithdrawDialogStore} from "@/stores/withdrawDialog";
import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name : 'CampaignsPendingActionsWithdrawDialog',
  setup() {
    const withdrawDialog = useWithdrawDialogStore()
    return {withdrawDialog}
  },
  data() {
    return {
      withdrawRadio: null,
    }
  },
  computed: {
    withdrawLabels() {
      return StatusLabels.withdraw
    }
  },
  methods: {
    withdraw() {
      this.withdrawDialog.withdraw(this.$axios)
    },
  }
}
</script>