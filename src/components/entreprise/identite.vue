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
    </h1>
    <v-layout wrap>
      <v-flex xs12 md6>
        <h3>siren {{ siren }}</h3>
        <hr style="color: #eee;" class="mr-4" />
        <div style="padding: 10px; margin: 4px;">
          <div v-html="identiteHtml" style="font-size: 17px"></div>
        </div>
        <v-tooltip bottom v-if="pge">
          <template v-slot:activator="{ on, attrs }">
          <v-chip color="indigo" v-bind="attrs" v-on="on" class="ma-2" label outlined >
            PGE en cours au 31/12/2021
          </v-chip>
          </template>
          <span>Cette entreprise était en train de rembourser un PGE au 31/12/2021</span>
        </v-tooltip>
        <div v-if="showSecteursCovid" class="text-uppercase" style="font-size: 18px">
          Secteurs COVID-19
          <Help
            style="position: relative; top: -3px; right: 10px"
            titre="Secteurs COVID-19"
            :big="true"
          >
            <p>Vous verrez ici des suggestions d’appartenance de l’entreprise à certains secteurs dits COVID-19 :</p>
            <p>
              <ul>
                <li>
                  <strong>S1</strong> : secteurs du tourisme, de l’hôtellerie, de la restauration, du sport, de la culture, du transport aérien et de l’événementiel qui ont été affectés par les conséquences économiques et financières de l’épidémie de COVID-19, en raison notamment de la dépendance de leur activité à l’accueil du public.<br>
                </li>
                <li>
                  <strong>S1 bis</strong> : secteurs dont l’activité dépend directement, en amont ou en aval, de celles du secteur S1 et qui ont subi une très forte baisse de leur chiffre d’affaires.
                </li>
                <li>
                  <strong>S2</strong> : autres secteurs d’activité (non exhaustif) impliquant l’accueil du public et dont l’activité a été interrompue du fait de la propagation de l’épidémie de COVID-19, à l’exclusion des fermetures volontaires.
                </li>
              </ul>
            </p>
            <p>Nous nous basons sur le code APE déclaré pour le siège. Or celui-ci peut ne pas être le reflet exact de l’activité principale de l'entreprise.</p>
            <p>Notez également que les secteurs suggérés peuvent évoluer en fonction des mises à jour du <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000041768315/2021-09-15" target="_blank" rel="noopener">décret relatif au fonds de solidarité</a> (version en vigueur au 15/09/2021).</p>
          </Help>
          <v-tooltip bottom v-if="s1">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-2" label outlined text-color="grey darken-3">S1 : très probable</v-chip>
            </template>
            <span>Cette entreprise fait très probablement partie du secteur S1 au titre de l'activité :<br>{{ s1.libelleActivite }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="s1Possible">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-2" label outlined text-color="grey darken-3" style="border-style: dashed solid">S1 : possible</v-chip>
            </template>
            <span>Cette entreprise peut faire partie du secteur S1 au titre de l'activité :<br>{{ s1Possible.libelleActivite }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="s1bis">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-2" label outlined text-color="grey darken-3">S1 bis : très probable</v-chip>
            </template>
            <span>Cette entreprise fait très probablement partie du secteur S1 bis au titre de l'activité :<br>{{ s1bis.libelleActivite }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="s1bisPossible">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-2" label outlined text-color="grey darken-3" style="border-style: dashed solid">S1 bis : possible</v-chip>
            </template>
            <span>Cette entreprise peut faire partie du secteur S1 bis au titre de l'activité :<br>{{ s1bisPossible.libelleActivite }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="s2">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-2" label outlined text-color="grey darken-3">S2 : très probable</v-chip>
            </template>
            <span>Cette entreprise fait probablement partie du secteur S2</span>
          </v-tooltip>
        </div>
      </v-flex>
      <v-flex xs12 md6>
        <h3>adresse postale du siège</h3>
        <hr style="color: #eee;" class="mr-4" />
        <div style="padding: 10px; margin: 4px; font-size: 17px">
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
                  <a href="https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44" target="_blank" rel="noopener">https://agence-cohesion-territoires.gouv.fr/territoires-dindustrie-44</a>
                </Help>
              </div>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <div v-if="relance" class="text-uppercase" style="font-size: 18px">
              <img
                class="mr-3"
                style="vertical-align: middle"
                height="64"
                src="../../assets/france-relance.png"
              />
              Lauréat {{ relance }}
              <Help
                style="position: relative; top: -3px; right: 10px"
                titre="Plan de relance"
              >
                Pour faire face aux impacts de la crise sanitaire, le Gouvernement mobilise en 2020, 2021 et 2022, des moyens exceptionnels dédiés au <a href="https://www.economie.gouv.fr/plan-de-relance/profils/entreprises/soutien-investissement-modernisation-industrie" target="_blank" rel="noopener">soutien à l’investissement et à la modernisation de l’industrie</a>.<br />
                Dans ce cadre, le ministère de l’Économie, des Finances et de la Relance (DGE) et Bpifrance, en lien avec les Conseils régionaux, mettent en place des appels à projets visant à soutenir des <em>projets d’investissement industriel au bénéfice de secteurs stratégiques et des territoires</em> :<br />
                <ul>
                  <li><strong>Projets territoriaux</strong> - Soutien à l’investissement industriel dans les territoires</li>
                  <li><strong>Automobile</strong> - Modernisation de la filière automobile</li>
                  <li><strong>Aéronautique</strong> - Modernisation de la filière aéronautique</li>
                  <li><strong>Relocalisation</strong> - (Re)localisation dans les secteurs critiques</li>
                  <li><strong>Efficacité énergétique</strong> - Efficacité énergétique et évolution des procédés dans l’industrie</li>
                  <li><strong>Soutien à la chaleur bas carbone</strong></li>
                  <li><strong>Santé - Capacités Covid</strong> - AMI Capacity, portant sur des capacités de production de produits thérapeutiques liés au COVID-19</li>
                </ul><br />
                <em>Source : portail des données ouvertes du Ministère de l'Economie, des Finances, et de la Relance.</em>
              </Help>
            </div>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import secteursCovid from '@/assets/secteurs_covid.json'
import axios from 'axios'

export default {
  name: 'EntrepriseIdentite',
  props: ['denomination', 'siren', 'siege', 'groupe', 'terrind', 'creation', 'statutJuridique', 'pge'],
  components: { Help },
  data() {
    return {
      secteursCovid,
      relance: null,
    }
  },
  mounted() {
    this.getRelance()
  },
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
    filteredSecteur(secteur) {
      return secteur.filter((a) => a.codeActivite === this.codeActivite)[0] || null
    },
    getRelance() {
      axios.create().get(process.env.VUE_APP_RELANCE_URL + this.siren).then((response) => {
        this.relance = response.data.records[0].fields.mesure_light
      }).catch((error) => {
        this.relance = null
      })
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
      return (this.naf.nomenActivite && this.naf.nomenActivite !== 'NAFRev2') ? ' - ' + this.naf.nomenActivite : ''
    },
    adresse() {
      return ((this.siege.sirene || {}).adresse || '').split('\n').join('<br />')
    },
    identiteHtml() {
      return [(this.libelleSecteur ? 'Secteur d’activité : ' + this.libelleSecteur : ''),
        ((this.libelleActivite && this.codeActivite) ? 'Activité : '
          + this.libelleActivite
          + ' (' + this.codeActivite + this.nomenActivite + ')' : ''),
        (this.statutJuridique ? 'Statut juridique : ' + this.statutJuridique : ''),
        (this.creation ? 'Date de création de l’entreprise : '
          + this.creation.toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
          + ' (' + this.pluralizeAge(this.calculateAge(this.creation)) + ')'
          : ''),
        (this.groupe ? 'Tête de groupe : ' + this.groupe : '')]
        .filter(Boolean).join('<br>')
    },
    showSecteursCovid() {
      return this.s1 || this.s1Possible || this.s1bis || this.s1bisPossible || this.s2
    },
    s1() {
      return this.filteredSecteur(this.secteursCovid.s1)
    },
    s1Possible() {
      return this.filteredSecteur(this.secteursCovid.s1Possible)
    },
    s1bis() {
      return this.filteredSecteur(this.secteursCovid.s1bis)
    },
    s1bisPossible() {
      return this.filteredSecteur(this.secteursCovid.s1bisPossible)
    },
    s2() {
      return this.filteredSecteur(this.secteursCovid.s2)
    },
  },
}
</script>
