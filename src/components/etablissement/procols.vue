<template>
  <div>
    <h2>
      Procédure collective
      <Help titre="Procédure collective">
        <template>
          <p>La dernière procédure collective (ou plan issu d'une procédure collective) connue de
            l'Urssaf est ici mise en avant.<br/>
            Vous avez également la possibilité de consulter l’historique des principaux jugements
            groupés par type de procédure collective : sauvegarde, redressement, liquidation
            judiciaire.<br/>
            Pour plus de détails encore, vous serez redirigés vers les annonces publiées au bulletin
            officiel (BODACC) pour cette entreprise.
          </p>
          <p>Vigilance : l’information présente dans SF a pour source URSSAF et non pas le Bodacc +
            actualisation trimestrielle. <br/>
            Conseil : veillez à vérifier la donnée sur site Bodacc ou bien contactez le tribunal de
            commerce compétent pour bénéficier des comptes rendus du jugement.</p>
          <p>Veuillez noter que les plans de cession lors d'un redressement judiciaire ne sont pas
            indiqués.
          </p>
        </template>
      </Help>
    </h2>
    <div v-if="summary && summary.etat_procol !== 'in_bonis'">
      <div>
        Cet établissement fait l’objet d’une procédure collective :<br/>
        <v-chip class="my-2 chip" outlined small text-color="red darken-1">
          {{ libellesProcols[summary.etat_procol] }}
        </v-chip>
      </div>
      <v-btn color="indigo" dark outlined small @click="jugementsDialog = true">Voir historique des
        jugements
      </v-btn>
      <v-dialog v-model="jugementsDialog" max-width="520px" @input="jugementsDialog = false">
        <div>
          <v-card style="font-family: Oswald" class="pl-2 pr-1">
            <v-card-title class="headline">
              Jugements de procédure collective

            </v-card-title>
            <v-card-text>
              Source: URSSAF <br/>

              <div v-if="liquidationJugements.length > 0" class="mt-4">
                <h3>Liquidation</h3>
                <ul style="list-style-type: disc">
                  <li v-for="j in liquidationJugements" :key="j">{{ j }}</li>
                </ul>
              </div>
              <div v-if="redressementJugements.length > 0" class="mt-4">
                <h3>Redressement</h3>
                <ul style="list-style-type: disc">
                  <li v-for="j in redressementJugements" :key="j">{{ j }}</li>
                </ul>
              </div>
              <div v-if="sauvegardeJugements.length > 0" class="mt-4">
                <h3>Sauvegarde</h3>
                <ul style="list-style-type: disc">
                  <li v-for="j in sauvegardeJugements" :key="j">{{ j }}</li>
                </ul>
              </div>
              <div class="mt-5" style="display: flex; flex-direction: row">
                <v-btn :href="lienBODACC" class="my-2 mb-4" color="indigo" dark rel="noopener"
                       target="_blank">Voir annonces BODACC
                </v-btn>
                <Gitbook :target="gitbookPath('INTERPRETATION_BODACC')" caption="procédures collectives"
                         class="mt-2"></Gitbook>
              </div>
              <div style="font-size: 14px;">
                <v-alert class="mr-4" icon="fa-warning">
                  Des différences avec les annonces BODACC peuvent exister. Une vérification avec le Tribunal de commerce
                  permettra de certifier l’information.
                </v-alert>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="jugementsDialog = false">fermer</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-dialog>
    </div>
    <div v-else>
      Cet établissement ne fait, à notre connaissance, pas l’objet d’une procédure collective.
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
import Help from "@/components/Help.vue";
import libellesProcols from '@/assets/libelles_procols.json'
import Gitbook from "@/components/Gitbook.vue";

export default {
  name: 'EtablissementProcols',
  props: ['etablissement', 'summary'],
  components: {Gitbook, Help},
  data() {
    return {
      jugementsDialog: false,
    }
  },
  methods: {
    date(date) {
      return new Date(date).toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
    }
  },
  computed: {
    libellesProcols() {
      return libellesProcols
    },
    lienBODACC() {
      return `https://www.bodacc.fr/pages/annonces-commerciales/?disjunctive.typeavis&disjunctive.familleavis&disjunctive.publicationavis&disjunctive.region_min&disjunctive.nom_dep_min&disjunctive.numerodepartement&sort=dateparution&q.registre=registre:${this.etablissement.siren}&refine.familleavis=collective#resultarea`
    },
    jugements() {
      return this.etablissement.procol
    },
    sauvegardeJugements() {
      return this.jugements.filter((jugement) => {
        return jugement.action === 'sauvegarde' && ['ouverture', 'plan_continuation'].includes(jugement.stade)
      }).map((jugement) => {
        const date = this.date(jugement.dateEffet)
        switch (jugement.stade) {
          case 'ouverture':
            return `${date} : Jugement d'ouverture d'une procédure de sauvegarde`
          case 'plan_continuation':
            return `${date} : Jugement arrêtant le plan de sauvegarde`
        }
      })
    },
    liquidationJugements() {
      return this.jugements.filter((jugement) => {
        return jugement.action === 'liquidation' && ['ouverture', 'cloture_insuffisance_actif'].includes(jugement.stade)
      }).map((jugement) => {
        const date = this.date(jugement.dateEffet)
        switch (jugement.stade) {
          case 'ouverture':
            return `${date} : Jugement d'ouverture de liquidation judiciaire`
          case 'cloture_insuffisance_actif':
            return `${date} : Jugement de clôture pour insuffisance d'actif`
        }
      })
    },
    redressementJugements() {
      return this.jugements.filter((jugement) => {
        return jugement.action === 'redressement' && ['ouverture', 'plan_continuation'].includes(jugement.stade)
      }).map((jugement) => {
        const date = this.date(jugement.dateEffet)
        switch (jugement.stade) {
          case 'ouverture':
            return `${date} : Jugement d'ouverture de liquidation judiciaire`
          case 'plan_continuation':
            return `${date} : Jugement de plan de continuation après un redressement judiciaire`
        }
      })
    },
  }
}
</script>
