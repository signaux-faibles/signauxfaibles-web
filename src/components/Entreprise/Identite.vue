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
    </h1>
    <v-layout wrap>
      <v-flex xs12 md6>
        <h3>siren {{ siren }}</h3>
        <hr style="color: #eee;" class="mr-4" />
        <div style="padding: 10px; margin: 4px;">
          <div v-html="activiteHtml" style="font-size: 16px"></div>
        </div>
      </v-flex>
      <v-flex xs12 md6>
        <h3>adresse postale du siège</h3>
        <hr style="color: #eee;" class="mr-4" />
        <div style="padding: 10px; margin: 4px; font-size: 16px">
          <v-layout wrap>
            <v-flex shrink>
              <div v-html="adresse" class="mb-3 mr-5"></div>
            </v-flex>
            <v-flex grow>
              <div v-if="terrind" class="text-uppercase" style="font-size: 18px">
                <img
                  class="mr-3 mb-3"
                  style="vertical-align: middle"
                  height="45"
                  src="../../assets/terrind.png"
                />
                {{ terrind }}
                <Help
                  style="position: relative; top: -3px; right: 10px"
                  titre="Territoires d’industrie"
                >
                  Les Territoires d’industrie sont des
                  <b>intercommunalités ou des groupes d’intercommunalités</b> situés dans les campagnes, les espaces périurbains, les villes petites et moyennes.
                  <br />Elles présentent
                  <b>une forte identité et un savoir-faire industriel</b> et l’ensemble de leurs acteurs, notamment les entreprises et les collectivités territoriales, sont mobilisés pour le développement de l’industrie.
                  <br />
                  <br />Pour en savoir davantage :
                  <a
                    href="https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44"
                    target="_blank"
                  >https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44</a>
                </Help>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'EntrepriseIdentite',
  props: ['denomination', 'siren', 'siege', 'groupe', 'terrind', 'creation'],
  components: { Help },
  methods: {
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
      return (this.siege.sirene || {}).naf || {}
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
    adresse() {
      return ((this.siege.sirene || {}).adresse || '').split('\n').join('<br />')
    },
    activiteHtml() {
      return [(this.libelleSecteur ? this.libelleSecteur : ''),
      (this.libelleActivite ? this.libelleActivite : ''),
      (this.codeActivite ? 'Code APE&nbsp;: ' + this.codeActivite + this.nomenActivite : ''),
      (this.creation ? 'Date de création de l\'entreprise&nbsp;: '
        + this.creation.toLocaleDateString('fr', { timeZone: 'Europe/Paris' })
        + ' (' + this.pluralizeAge(this.calculateAge(this.creation)) + ')'
        : ''),
      (this.groupe ? 'Tête de groupe&nbsp;: ' + this.groupe : '')]
        .filter(Boolean).join('<br>')
    },
  },
}
</script>