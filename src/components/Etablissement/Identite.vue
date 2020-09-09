<template>
  <div>
    <h1>
      {{ denomination }}
      <Help style="position: relative; top: -3px; right: 10px" titre="Identité de l'entreprise">
        <b>Raison Sociale, Coordonnées:</b>
        Ces données sont issues du service API entreprises fourni par la DINSIC qui redistribue les données de l'INSEE.
        <br />
        <b>Activité de l'entreprise:</b>
        Le code activité est issu de la base Sirène produite par l'INSEE et correspond aux données déclaratives fournies par l'entreprise. Il peut être constaté un décalage entre le code déclaré et l'activité réelle de l'entreprise.
      </Help>
    </h1>
    <Historique style="padding: 4px; position: relative; bottom: 5px" :historique="historique" />
    <h3>
      siren {{ siret.slice(0,9) }}
      <span style="color: #999">{{ siret.slice(9,14) }} siret</span>
    </h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px;">
      <div style="font-size: 16px">
        {{ libelleSecteur }}
        <br />
        {{ libelleActivite }}
        <br />
        Code APE&nbsp;: {{ codeActivite }}
      </div>
    </div>
    <h3>adresse postale</h3>
    <hr style="color: #eee;" />
    <div style="padding: 10px; margin: 4px; font-size: 16px">
      <div v-if="(adresse || '') != ''">
        <b v-html="adresse">
        </b>
      </div>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Historique from '@/components/Etablissement/Historique.vue'

export default {
  name: 'Identite',
  props: ['denomination', 'historique', 'siret', 'sirene', 'adresse'],
  components: { Help, Historique },
  computed: {
    naf() {
      return (this.sirene || {}).naf || {}
    },
    libelleSecteur() {
      return this.naf.libelleSecteur || ''
    },
    libelleActivite() {
      return this.naf.libelleactivite || ''
    },
    codeActivite() {
      return this.naf.codeActivite || ''
    },
  },
}
</script>