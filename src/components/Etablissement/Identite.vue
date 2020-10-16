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
    <Historique style="padding: 4px; position: relative; bottom: 5px" :historique="historique" />
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
              Pour en savoir davantage : <a href="https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44">https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44</a>
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
  props: ['denomination', 'historique', 'siret', 'sirene', 'siege', 'groupe', 'terrind'],
  components: { Help, Historique },
  methods: {
    showFollowDialog() {
      this.$parent.followDialog = true
    },
    showUnfollowDialog() {
      this.$parent.unfollowDialog = true
    },
  },
  computed: {
    naf() {
      return (this.sirene || {}).naf || {}
    },
    libelleSecteur() {
      return this.naf.libelleSecteur || ''
    },
    libelleActivite() {
      return this.naf.libelleActivite || ''
    },
    codeActivite() {
      return this.naf.codeActivite || ''
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
        (this.groupe ? 'Groupe&nbsp;: ' + this.groupe : '')]
        .filter(Boolean).join('<br>')
    },
  },
}
</script>