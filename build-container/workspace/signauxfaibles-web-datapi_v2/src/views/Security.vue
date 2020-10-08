<template>
  <v-dialog v-model="dialog" persistent max-width="50%">
    <v-card>
    <v-card-title class="headline">La confidentialité est l'affaire de tous !</v-card-title>
      <v-card-text>
        Les listes que vous consultez ainsi que les informations délivrées dans cet espace sécurisé sont sensibles.
        Il convient de les manipuler avec précaution et confidentialité. <br/>
        <br/>
        <ul>
          <li>Ne partagez pas vos identifiants. Toutes les personnes habilitées à consulter ces listes en disposent ou pourront en disposer.</li>
          <li>Ne diffusez aucune information pouvant porter préjudice à une entreprise.</li>
          <li>Ne partagez que l’information factuelle nécessaire à l’accompagnement de l’entreprise.</li>
        </ul>
        <br/>
        <b>Gardez à l'esprit que cette application existe dans le seul et unique but de porter assistance aux entreprises et de soutenir leur activité, ne détournez pas son usage. </b>
        <br/> <br/>
        En transgressant ces règles, vous vous exposez à des sanctions pouvant aller jusqu'à <b>500&nbsp;000 € d'amende</b> et <b>5 ans d’emprisonnement</b>.<br/><br/>
        Voir les articles 
        <a href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000006417945&cidTexte=LEGITEXT000006070719&dateTexte=20020101">L226-13</a> et 
        <a href="https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000006073189&idArticle=LEGIARTI000035624366&dateTexte=&categorieLien=cid">L432-12</a> du code pénal et 
        <a href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000032751633&cidTexte=LEGITEXT000006072026&dateTexte=20160703">L465-1</a> du code monétaire et financier. 
        <br/>

      </v-card-text>
      <v-card-actions style="margin: 10px">
      <v-checkbox v-model="check" label="J'ai lu et j'engage ma responsabilité"/>
      <v-spacer></v-spacer>
      <v-btn color="indigo darken-4" dark text @click="validation" :disabled="!check">ok</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
      check: false,
    }
  },
  mounted() {
    if (window._paq) {
      window._paq.push(['trackEvent', 'general', 'ouvrir_consentement_securite'])
    }
  },
  methods: {
    validation() {
      if (window._paq) {
        window._paq.push(['trackEvent', 'general', 'valider_consentement_securite'])
      }
      const now = new Date()
      this.$localStore.commit('setSecurityConsent', now)
    },
  },
}
</script>