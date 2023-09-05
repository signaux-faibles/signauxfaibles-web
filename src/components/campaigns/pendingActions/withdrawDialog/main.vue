<template>
  <div>
    <v-dialog v-model="dialogs.campaignWithdrawDialog" height=50% width=50%>
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="red darken-3" dark>
          <v-toolbar-title class="localtoolbar">Je repousse cette prise de contact ({{ dialogs.campaignWithdrawDialogRaisonSociale }})</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            Vous souhaitez mettre à l'écart cette prise de contact, qu'est ce qui motive cette décision ?
            <v-radio-group v-model="withdrawRadio">
              <v-radio v-for="(label, value) in withdrawLabels" :key="value" :label="label" :value="value"/>
            </v-radio-group>
            <div style="text-align: right">
              <v-btn class="mr-4" color="indigo" outlined dark @click="hideWithdraw">
                RETOUR
              </v-btn>
              <v-btn :color="(withdrawRadio != null)?'indigo':null" :dark="withdrawRadio != null"
                     :disabled="!withdrawRadio" @click="withdraw">
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
import {useDialogsStore} from "@/stores/dialogs";
import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name : 'CampaignsPendingActionsWithdrawDialog',
  props: ['withdrawDialog'],
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
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
    hideWithdraw() {
      this.dialogs.campaignWithdrawDialogEtablissementID = null
      this.dialogs.campaignWithdrawDialogCampaignID = null
      this.dialogs.campaignWithdrawDialogRaisonSociale = null
      this.dialogs.campaignWithdrawDialog = false
    },
    withdraw() {},
  }
}
</script>