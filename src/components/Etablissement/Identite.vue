<template>
  <div>
    <h1>
      {{ sirene.nom_raison_sociale }} 
      <Help style="position: relative; top: -3px; right: 10px" titre="Identité de l'entreprise">
        <b>Raison Sociale, Coordonnées:</b>
        Ces données sont issues du service API entreprises fourni par la DINSIC qui redistribue les données de l'INSEE.<br/>
        <b>Activité de l'entreprise:</b>
        Le code activité est issu de la base Sirène produite par l'INSEE et correspond aux données déclaratives fournies par l'entreprise. Il peut être constaté un décalage entre le code déclaré et l'activité réelle de l'entreprise.
      </Help>
    </h1>
    <Historique style="padding: 4px; position: relative; bottom: 5px" :historique="historique"/>
    <h3>siren {{ siret.slice(0,9) }} <span style="color: #999">{{ siret.slice(9,14) }} siret</span></h3>
    <hr style="color: #eee;"/>
    <div style="padding: 10px; margin: 4px;">
      <div style="font-size: 16px">
        {{ (naf.n1 || {})[((naf.n5to1 || {})[(sirene.activite_principale || '')] || '')] }}<br/>
        {{ (naf.n5 || {})[(sirene.activite_principale || '')] }}<br/>
        Code APE: {{ (sirene.activite_principale || '') }}<br/>
        <p v-if="lienVisiteFCE">
          Cet établissement a fait l'objet d'une visite. 
          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="lienVisiteFCE"
          >Consulter Fiche Commune Entreprise</a>
        </p>
      </div>
    </div>
    
    <h3>adresse postale</h3>
    <hr style="color: #eee;"/>
    <div style="padding: 10px; margin: 4px; font-size: 16px">
      <div v-if="(sirene.l1_normalisee||'')!=''"><b>{{ sirene.l1_normalisee }} <br/></b></div>
      <div v-if="(sirene.l2_normalisee||'')!=''"><b>{{ sirene.l2_normalisee }} <br/></b></div>
      <div v-if="(sirene.l3_normalisee||'')!=''"><b>{{ sirene.l3_normalisee }} <br/></b></div>
      <div v-if="(sirene.l4_normalisee||'')!=''"><b>{{ sirene.l4_normalisee }} <br/></b></div>
      <div v-if="(sirene.l5_normalisee||'')!=''"><b>{{ sirene.l5_normalisee }} <br/></b></div>
      <div v-if="(sirene.l6_normalisee||'')!=''"><b>{{ sirene.l6_normalisee }} <br/></b></div>
      <div v-if="(sirene.l7_normalisee||'')!=''"><b>{{ sirene.l7_normalisee }} <br/></b></div> 
    </div>
  </div>     
</template>

<script>
import Help from '@/components/Help.vue'
import Historique from '@/components/Etablissement/Historique.vue'

export default {
  name: 'Identite',
  props: ['sirene', 'historique', 'siret', 'naf', 'lienVisiteFCE'],
  components: { Help, Historique },
}
</script>