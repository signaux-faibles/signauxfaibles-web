<template>
  <v-card>
    <v-card-text class="pt-4">
      <span style="font-size: 17px">
        Vous êtes sur le point d'accompagner l'entreprise.
        Écrivez en quelques lignes :
        <ul class="pb-4">
          <li>les difficultés de l'entreprise</li>
          <li>les actions que vous comptez entreprendre</li>
        </ul>

      <Editor class="mb-4"
              :options="editorOptions()"
              initialEditType="wysiwyg"
      />Vous serez le premier accompagnant de cet entreprise, pensez à inviter les autres membres de votre groupe à vous rejoindre.
    </span>
    </v-card-text>
    <v-card-actions class="pb-3">
      <v-spacer></v-spacer>
      <v-btn color="indigo" style="text-transform: none" text
             @click="previousStep">
        Retour
      </v-btn>
      <v-btn color="indigo" style="text-transform: none" dark
             @click="createCard">
        Enregistrer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {useDialogsStore} from "@/stores/dialogs";
import {Editor} from '@toast-ui/vue-editor';

export default {
  name: 'DialogCreateCardCampaignStep2',
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  components: {Editor},
  methods: {
    editorOptions() {
      return {
        minHeight: '400px',
        language: 'fr',
        initialValue: this.dialogs.campaignCardEditorDescription,
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['link', 'table'],
        ]
      }
    },
    previousStep() {
      this.dialogs.createCardSequence = 'start'
    }
  }
}
</script>