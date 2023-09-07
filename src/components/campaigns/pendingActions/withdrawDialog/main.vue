<template>
  <div>
    <v-dialog persistent v-model="withdrawDialog.visible" height=50% width=50%>
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="red darken-3" dark>
          <v-toolbar-title class="localtoolbar">Je repousse cette prise de contact ({{ withdrawDialog.raisonSociale }})</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            Vous souhaitez mettre à l'écart cette prise de contact, qu'est ce qui motive cette décision ?
            <v-radio-group v-model="withdrawDialog.radio">
              <v-radio v-for="(label, value) in withdrawLabels" :key="value" :label="label" :value="value"/>
            </v-radio-group>
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