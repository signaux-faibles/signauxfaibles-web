<template>
    <div>
        <v-card flat>
            <v-card-text class="text">
                <h1>Liste de détection de Mai 2022</h1>
                La liste de Mai 2022 est désormais en ligne et comprend des améliorations :
                <ul>
                    <li>Un nouveau filtre permettant de se focaliser sur les premières alertes</li>
                    <li>Ré-inclusion des données de retards de paiement dans le modèle</li>
                    <li>Une redéfinition des redressements experts</li>
                    <li>Une fiabilisation des données sources du modèle</li>
                </ul><p/>
                <h2>Une explicabilité plus détaillée</h2>
                La fiche établissement est maintenant dotée d'un encart d'explicabilité détaillant plus précisément les raisons de la détection.
                Une aide contextuelle est disponible en cliquant sur les <v-icon small>help</v-icon> disposés dans l'application.
                <h2>Premières alertes</h2>
                Le nouveau filtre « Premières alertes » est positionné dans le panneau de filtrage des listes de détection comme indiqué sur la copie d'écran ci-dessous :<p/>
                <v-card width="60%" >
                    <v-img src="/news/001/screen_premiere_alerte.png"/>
                </v-card>
                <p/>
                En activant cette option, vous sélectionnez uniquement les alertes présentant le badge
                <v-chip v-bind="attrs" v-on="on"  class="ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip><p/>

                <span class="red-darken-4">
                    <v-icon color="red darken-4" small>nearby_error</v-icon>
                    En utilisant ce filtre, vous pouvez passer à côté d'entreprises qui ont déjà fait l'objet d'alertes (orange ou rouge) au sein de listes précédemment publiées dans l'application.
                </span><p/>

                <h2>Retards de paiement</h2>
                Le partenariat Signaux-Faibles dispose de données sur les retards de paiement aux fournisseurs. 
                Ces données sont disponibles lorsque nous en disposons en bas de la fiche entreprise sous cette forme :<p/>
                <v-card width="50%">
                    <v-img src="/news/001/screen_paydex.png"></v-img>
                </v-card><p/>
                Le modèle utilisé dans la liste de Mai 2022 introduit l'évaluation de ces données pour affiner le niveau d'alerte pré-crise et vous pouvez à cet égard bénéficier de cette analyse dans le radar d'explication du score lorsque l'entreprise dispose de ces informations:
               <v-card width="50%">
                    <v-img src="/news/001/screen_radar.png"></v-img>
                </v-card><p/>                

                <a href="https://www.altares.com/fr/nos-data/paydex/">Plus d'information sur la données Paydex</a><p/>


                <h2>Redressements experts</h2>
                Nous avons mis à jour les redressements experts, permettant un ajustement du niveau d'alerte post-pandémie adapté 
                à la conjoncture et à l'évolution récente des signaux donnant lieu à une détection.<p/>

                Trois redressements experts associés aux paiement des cotisations sociales et aux demandes d'activité partielle 
                sont susceptibles d'intervenir dans la détection. 
                
                Afin d'éviter les effets extrêmes, nous avons volontairement bridé la combinaison des redressements à un seul changement de niveau : une entreprise 
                ne peut pas passer de <v-icon small color="green">fa-check-circle</v-icon> à <v-icon small color="red accent-2">fa-exclamation-triangle</v-icon>
                (et inversement) en raison des redressements.<p/>

                <h3>Les dettes sociales datant de la crise Covid sont résorbées</h3>
                Ce signal modère le niveau d'alerte. Quand cela se produit, vous en êtes informé de cette façon dans les explications de la détection :<p/>
                <v-card width="65%">
                    <v-img src="/news/001/screen_diminution_dette_urssaf_ancienne.png"></v-img>
                </v-card><p/>
                Ce redressement s'active dès que le niveau maximum de dette sociale atteint avant Septembre 2021, à condition qu'il soit significatif, est dix fois plus grand que le niveau résiduel de dette actuelle.<p/>

                <h3>Les dettes sociales repartent à la hausse</h3>
                Ce signal augmente le niveau d'alerte. Vous êtes notifié de cette information de cette façon :<p/>
                <v-card width="60%">
                    <v-img src="/news/001/screen_augmentation_dette_recente.png"></v-img>
                </v-card><p/>
                Ce redressement s'active lorsque l'entreprise voit le montant de sa dette sociale augmenter de façon significative depuis Septembre 2021. Il a la priorité sur le signal précédent concernant la resorption de la dette ancienne.<p/>

                <h3>L'entreprise a demandé beaucoup d'activité partielle sur les 12 derniers mois</h3>
                Ce signal augmente le niveau d'alerte. Vous êtes notifié de cette information de cette façon :<p/>
                <v-card width="62%">
                    <v-img src="/news/001/screen_demande_activite_partielle_elevee.png"></v-img>
                </v-card><p/>
                Ce redressement s'active lorsqu'un des établissements de l'entreprise a effectué une demande d'activité partielle supérieure ou égale à 12 mois et concernant plus de 50% de ses effectifs.
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
</style>
