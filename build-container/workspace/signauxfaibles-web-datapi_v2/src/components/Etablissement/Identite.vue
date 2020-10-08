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
      {{ this.siege ? ' (siège)' : ''}}
    </h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px;">
      <div style="font-size: 16px">
        {{ libelleSecteur }}
        <br />
        {{ libelleActivite }}
        <br />
        Code APE&nbsp;: {{ codeActivite }}
        <br />
        {{ this.groupe ? 'Groupe : ' + this.groupe : ''}}
      </div>
    </div>
    <h3>adresse postale de l'établissement</h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px; font-size: 16px">
      <div v-html="adresse"></div>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Historique from '@/components/Etablissement/Historique.vue'

export default {
  name: 'Identite',
  props: ['denomination', 'historique', 'siret', 'sirene', 'siege', 'groupe'],
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
    followed() {
      return this.$parent.followed
    },
    adresse() {
      return ((this.sirene || {}).adresse || '').split('\n').join('<br />')
    },
  },
}
</script>