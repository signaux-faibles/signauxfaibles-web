<template>
  <div>
    <h1>
      {{ denomination }}
      <Help style="position: relative; top: -3px; right: 10px" titre="Identité de l'entreprise">
        <b>Raison Sociale, Coordonnées:</b>
        Ces données sont issues du service API entreprises fourni par la DINUM qui redistribue les données de l'INSEE.
        <br />
        <b>Activité de l'entreprise:</b>
        Le code activité est issu de la base Sirène produite par l'INSEE et correspond aux données déclaratives fournies par l'entreprise. Il peut être constaté un décalage entre le code déclaré et l'activité réelle de l'entreprise.
      </Help>
      <v-btn v-if="followed === false" dark color="indigo darken-5" @click="showFollowDialog"><v-icon left class="mr-2">mdi-star-outline</v-icon>Suivre</v-btn>
      <v-btn v-if="followed === true" outline color="indigo darken-5" @click="showUnfollowDialog"><v-icon left class="mr-2">mdi-star</v-icon>Ne plus suivre</v-btn>
    </h1>
    <v-layout ma-2 wrap>
      <v-flex md6 xs12>
        <Historique :historique="historique" />
      </v-flex>
      <v-flex md4 xs12>
        <div v-if="visiteFCE">
          <h2>
            Visites de la Direccte
            <Help titre="Visites de la Direccte">
              <template>
                Cette information est fournie par <a href="https://fce.fabrique.social.gouv.fr/a-propos" target="_blank">Fiche Commune Entreprise</a>.<br>
                Vous pouvez consulter ce service édité par l'incubateur des ministères sociaux pour en savoir davantage sur la date et la nature des visites.<br>
                Un compte Fiche Commune Entreprise avec une adresse email <code>@direccte.gouv.fr</code> est nécessaire.
              </template>
            </Help>
          </h2>
          Cet établissement a reçu la visite de la Direccte au cours des 24 derniers mois.
          <v-btn v-if="showFCE" class="ma-3" small outline color="indigo darken-5" :href="lienVisiteFCE" target="_blank"><v-icon small left class="mr-2">open_in_new</v-icon>Fiche Commune Entreprise</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <h3>
      siren {{ siret.slice(0,9) }}
      <span style="color: #999">{{ siret.slice(9,14) }} siret</span>
      {{ siege ? ' (siège)' : '' }}
    </h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px;">
      <div v-html="activiteHtml" style="font-size: 16px"></div>
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
            <Help style="position: relative; top: -3px; right: 10px" titre="Territoires d’industrie">
              Les Territoires d’industrie sont des <b>intercommunalités ou des groupes d’intercommunalités</b> situés dans les campagnes, les espaces périurbains, les villes petites et moyennes.<br />
              Elles présentent <b>une forte identité et un savoir-faire industriel</b> et l’ensemble de leurs acteurs, notamment les entreprises et les collectivités territoriales, sont mobilisés pour le développement de l’industrie.<br /><br />
              Pour en savoir davantage : <a href="https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44" target="_blank">https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44</a>
            </Help>  
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Historique from '@/components/Etablissement/Historique.vue'

export default {
  name: 'Identite',
  props: ['denomination', 'historique', 'siret', 'sirene', 'siege', 'groupe', 'terrind', 'creation', 'visiteFCE'],
  components: { Help, Historique },
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
      return (this.naf.nomenActivite && this.naf.nomenActivite !== 'NAFRev2') ? ' (' + this.naf.nomenActivite + ')' : ''
    },
    followed() {
      return this.$parent.followed
    },
    adresse() {
      return ((this.sirene || {}).adresse || '').split('\n').join('<br />')
    },
    activiteHtml() {
      return [(this.libelleSecteur ? this.libelleSecteur : ''),
        (this.libelleActivite ? this.libelleActivite : ''),
        (this.codeActivite ? 'Code APE&nbsp;: ' + this.codeActivite + this.nomenActivite : ''),
        (this.ouverture ? 'Date d\'ouverture de l\'établissement&nbsp;: '
          + this.ouverture.toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
          + ' (' + this.pluralizeAge(this.calculateAge(this.ouverture)) + ')'
          : ''),
        (this.creation ? 'Date de création de l\'entreprise&nbsp;: '
          + this.creation.toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
          + ' (' + this.pluralizeAge(this.calculateAge(this.creation)) + ')'
          : ''),
        (this.groupe ? 'Tête de groupe&nbsp;: ' + this.groupe : '')]
        .filter(Boolean).join('<br>')
    },
    lienVisiteFCE() {
      return `https://fce.fabrique.social.gouv.fr/establishment/${this.siret}#direccte`
    },
    showFCE() {
      const emailDomain = this.jwt.email.split('@').pop()
      return process.env.VUE_APP_FCE_ENABLED && !!JSON.parse(process.env.VUE_APP_FCE_ENABLED)
        && process.env.VUE_APP_FCE_DOMAIN_LIST.split(',').includes(emailDomain)
    },
  },
}
</script>