<template>
  <div>
    <h1>
      {{ denomination }}
      <Help titre="Identité de l’entreprise">
        <p>Les données d’identité de l’entreprise sont principalement issues de la base Sirene des entreprises et de leurs établissements produite par l’Insee.</p>
        <p>L’<b>activité</b> est une donnée déclarative fournie par l’entreprise lors de sa création. Il peut être constaté un décalage entre le code déclaré et l’activité réelle de l’entreprise.</p>
        <p>Le <b>statut juridique</b> indiqué correspond à la catégorie juridique de niveau II (37 positions suivant les critères juridiques fondamentaux du droit).</p>
        <p>Les <b>têtes de groupe</b> ont été obtenues auprès de la société Ellisphere. Sauf cas particulier d’arbitrage, est considérée comme tête de groupe (ou société mère) l’entreprise qui détient de façon directe ou indirecte plus de 50% du capital et qui n’est pas elle-même détenue à plus de 50% par une autre entreprise.</p>
      </Help>
      <v-btn v-if="followed === false" dark color="indigo" @click="showFollowDialog"><v-icon left class="mr-2">mdi-star-outline</v-icon>Suivre</v-btn>
      <v-btn v-if="followed === true" outline color="indigo" @click="showUnfollowDialog"><v-icon left class="mr-2">mdi-star</v-icon>Ne plus suivre</v-btn>
    </h1>
    <h3 class="mt-3">
      siren {{ siret.slice(0,9) }}
      <span style="color: #999">{{ siret.slice(9,14) }} siret</span>
      {{ siege ? ' (siège)' : '' }}
    </h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px;">
      <div v-html="identiteHtml" style="font-size: 16px"></div>
    </div>
    <h3>adresse postale de l'établissement</h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px; font-size: 16px">
      <v-layout wrap>
        <v-flex shrink>
          <div v-html="adresse" class="mb-3 mr-5"></div>
        </v-flex>
        <v-flex grow>
          <div v-if="terrind" class="text-uppercase" style="font-size: 18px">
            <img class="mr-3 mb-3" style="vertical-align: middle" height="45" src="../../assets/terrind.png" />{{ terrind }}
            <Help titre="Territoires d’industrie">
              Les Territoires d’industrie sont des <b>intercommunalités ou des groupes d’intercommunalités</b> situés dans les campagnes, les espaces périurbains, les villes petites et moyennes.<br />
              Elles présentent <b>une forte identité et un savoir-faire industriel</b> et l’ensemble de leurs acteurs, notamment les entreprises et les collectivités territoriales, sont mobilisés pour le développement de l’industrie.<br /><br />
              Pour en savoir davantage : <a href="https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44" target="_blank" rel="noopener">https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44</a>
            </Help>  
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'Identite',
  props: ['denomination', 'siret', 'sirene', 'siege', 'groupe', 'terrind', 'creation', 'statutJuridique', 'summary'],
  components: { Help},
  methods: {
    showFollowDialog() {
      this.$parent.followDialog = true
    },
    showUnfollowDialog() {
      this.$parent.unfollowDialog = true
    },
    calculateAge(birthday) {
      const ageDiff = Date.now() - birthday.getTime()
      return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970)
    },
    pluralizeAge(count) {
      if (count === 0) {
        return 'moins d\'1 an'
      } else if (count === 1) {
        return '1 an'
      } else {
        return count + ' ans'
      }
    },
  },
  computed: {
    naf() {
      return (this.sirene || {}).naf || {}
    },
    ouverture() {
      const ouvertureEtablissement = new Date((this.sirene || {}).creation)
      const msInADay = 86400000
      // rustine temporaire pour gérer les différences de TZ et exclure les dates d'ouverture improbables
      return (!isNaN(ouvertureEtablissement.getTime())
        && ouvertureEtablissement - this.creation > -msInADay) ? ouvertureEtablissement : null
    },
    libelleSecteur() {
      return this.naf.libelleSecteur
    },
    libelleActivite() {
      return this.naf.libelleActivite
    },
    codeActivite() {
      return this.naf.codeActivite
    },
    nomenActivite() {
      return (this.naf.nomenActivite && this.naf.nomenActivite !== 'NAFRev2') ? ' - ' + this.naf.nomenActivite : ''
    },
    followed() {
      return this.$parent.followed
    },
    adresse() {
      return ((this.sirene || {}).adresse || '').split('\n').join('<br />')
    },
    identiteHtml() {
      return [(this.libelleSecteur ? 'Secteur d’activité : ' + this.libelleSecteur : ''),
        ((this.libelleActivite && this.codeActivite) ? 'Activité : '
          + this.libelleActivite
          + ' (' + this.codeActivite + this.nomenActivite + ')' : ''),
        (this.statutJuridique ? 'Statut juridique : ' + this.statutJuridique : ''),
        (this.ouverture ? 'Date d’ouverture de l’établissement : '
          + this.ouverture.toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
          + ' (' + this.pluralizeAge(this.calculateAge(this.ouverture)) + ')'
          : ''),
        (this.creation ? 'Date de création de l’entreprise : '
          + this.creation.toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
          + ' (' + this.pluralizeAge(this.calculateAge(this.creation)) + ')'
          : ''),
        (this.groupe ? 'Tête de groupe : ' + this.groupe : '')]
        .filter(Boolean).join('<br>')
    },
  },
}
</script>