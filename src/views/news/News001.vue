<template>
    <div>
        <v-card flat>
            <v-card-text class="text">
                <h1>Signalements « Mai 2022 »</h1>
                <ul>
                    <li>Un nouveau filtre: Premières alertes</li>
                    <li>Un radar de détection plus précis</li>
                    <li>Retards de paiement intégrés dans le modèle</li>
                    <li>3 nouveaux redressements experts</li>
                </ul><p/>

                <h2>Premières alertes</h2>
                Le filtre « Premières alertes » est positionné sur la droite dans le panneau de filtrage des listes de détection.
                Ce filtre permet de sélectionner uniquement les alertes présentant le badge
                <v-chip class="mb-1 ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip>
                indiquant que l'entreprise n'avait jamais fait l'objet d'alertes (rouges ou oranges) avant cette liste.
                <v-card width="40%" ><v-img src="/news/001/screen_premiere_alerte.png"/></v-card><p/>
                <h2>Radar</h2>
                Le radar présenté sur les fiches établissement détaille plus précisément les raisons de la détection:
                <v-card width="60%" ><v-img src="/news/001/screen_radar.png"/></v-card>

                <h2>Retards de paiement</h2>
                L'indice Paydex, disponible dans la fiche entreprise, est désormais intégré dans les détections.<br/>
                
                Pour rappel, lorsqu'il existe, cet indice est présenté dans la fiche entreprise :<br/>
                <v-card width="50%">
                    <v-img src="/news/001/screen_paydex.png"></v-img>
                </v-card><p/>
                <a href="https://www.altares.com/fr/nos-data/paydex/">Plus d'information sur l'indice Paydex</a><p/>
                
                <h2>Redressements experts</h2>
                Afin d'adapter les prédictions à la conjecture et à l'évolution récente, 3 redressements experts ont été mis en place.

                <h3>Deux redressements défavorables</h3>
                <v-card width="62%"><v-img src="/news/001/screen_demande_activite_partielle_elevee.png"></v-img></v-card>
                Ce redressement s'active lorsqu'un des établissements de l'entreprise a effectué une demande d'activité partielle supérieure ou égale à 12 mois et concernant plus de 50% de ses effectifs.

                <v-card width="60%"><v-img src="/news/001/screen_augmentation_dette_recente.png"></v-img></v-card>
                Ce redressement s'active lorsque l'entreprise voit le montant de sa dette sociale augmenter de façon significative depuis septembre 2021. Il annule l'effet d'une diminution de la dette..<p/>

                <h3>Un redressement favorable</h3>
                <v-card width="65%"><v-img src="/news/001/screen_diminution_dette_urssaf_ancienne.png"></v-img></v-card>
                Ce redressement s'active dès que le niveau maximum de dette sociale atteint avant Septembre 2021, à condition qu'il soit significatif, est dix fois plus grand que le niveau résiduel de dette actuelle.<p/>


            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="js">
export default {

}
</script>

<style scoped>
    .text {
        line-height: 1.7;
    }
    .red-darken-4 {
        color: #B71C1C;
    }
    h1 {
        color: #333;
    }
</style>
