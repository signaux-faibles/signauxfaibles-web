<template>
    <div>
        <v-card flat>
            <v-card-text class="text">
                <h1>Liste de détection de Mai 2022</h1>
                La liste de Mai 2022 est désormais en ligne et comprend des améliorations:
                <ul>
                    <li>Ré-inclusion des données de retards de paiement dans le modèle</li>
                    <li>Une fiabilisation des données sources du modèle et une redéfinition des redressements experts</li>
                    <li>Un nouveau filtre permettant de se focaliser sur les premières alertes</li>
                </ul><p/>
                <h2>Premières Alertes</h2>
                Le nouveau filtre « Premières alertes » est positionné dans le panneau de filtrage des listes de détection comme indiqué sur la copie d'écran ci-dessous:<p/>
                <v-card width="40vh" >
                    <v-img src="/news/001/screen_premiere_alerte.png"/>
                </v-card>
                <p/>
                En activant cette option, vous sélectionnez uniquement les alertes présentant le badge
                <v-chip v-bind="attrs" v-on="on"  class="ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip><p/>

                <span class="red-darken-4">
                    <v-icon color="red darken-4" small>nearby_error</v-icon>
                    En utilisant ce filtre, vous pouvez passer à côté les entreprises qui ont déjà fait l'objet d'alertes (orange ou rouge) depuis les première listes publiées dans l'application datant de 2019.
                </span><p/>

                <h2>Retards de paiement</h2>    
                Le partenariat Signaux-Faibles dispose de données sur les retards de paiement aux fournisseurs.
                Ces données sont toujours disponibles en bas de la fiche entreprise sous cette forme:<p/>
                <v-card width="50vh">
                    <v-img src="/news/001/screen_paydex.png"></v-img>
                </v-card><p/>

                <h2>Redressements Experts</h2>
                <h3>Les dettes sociales datant de la crise Covid sont résorbées</h3>
                Ce signal fait baisser le niveau d'alerte d'un cran. Quand cela se produit, vous en êtes informé de cette façon dans les explications de la détection: <p/>
                <v-card width="41vh">
                    <v-img src="/news/001/screen_diminution_dette_urssaf_ancienne.png"></v-img>
                </v-card><p/>
                Ce redressement s'active dès que le niveau maximum de dette sociale atteint avant Septembre 2021, à condition qu'il soit significatif, est dix fois plus grand que le niveau résiduel de dette actuelle.<p/>
                <h3>Les dettes sociales repartent à la hausse</h3>
                Ce signal augmente le niveau d'alerte d'un cran. Vous êtes notifié de cette information de cette façon:<p/>
                <v-card width="45vh">
                    <v-img src="/news/001/screen_augmentation_dette_recente.png"></v-img>
                </v-card><p/>
                Ce redressement s'active lorsque l'entreprise voit le montant de sa dette sociale augmenter de façon significative depuis Septembre 2021. EIl a la priorité sur le signal précédent concernant la resorption de la dette ancienne.<p/>
                <h3>L'entreprise a demandé beaucoup d'activité partielle sur les 12 derniers mois</h3>

            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
    .text {
        line-height: 1.7;
    }
    .red-darken-4 {
        color: #B71C1C;
    }
</style>