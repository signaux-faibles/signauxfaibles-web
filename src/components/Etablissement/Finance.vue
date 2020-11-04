<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">Informations financières</v-toolbar-title>
      <v-spacer/>
      <Help titre="Informations financières">
        <template>
          <p>Cette rubrique fait la synthèse des informations financières de l'entreprise sur les trois derniers exercices connus.</p>
          <p>Le premier graphique représente les soldes intermédiaires de gestion (SIG) : chiffre d'affaires (CA), valeur ajoutée (VA), excédent brut d'exploitation (EBE), résultat d'exploitation (REX), résultat net (RN) et capacité d'autofinancement (CAF).</p>
          <p>Le second graphique fait état de la trésorerie nette (TN) au travers du fonds de roulement net global (FRNG) et du besoin en fonds de roulement (BFR).</p>
          <p>Des ratios financiers vous sont ensuite proposés selon 4 catégories : structure et liquidité, gestion, productivité et rentabilité, marge et valeur ajoutée.<br><em>Fournisseur : Diane.</em></p>
          <p>Si besoin, il vous est possible de télécharger l'ensemble des documents comptables de l'entreprise.</p>
        </template>
      </Help>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap>
        <v-flex md6 xs12><apexchart width="100%" heigth="100%" type="bar" :options="sigOptions" :series="sigSeries"></apexchart></v-flex>
        <v-flex md6 xs12><apexchart width="100%" heigth="100%" type="bar" :options="tresorerieOptions" :series="tresorerieSeries"></apexchart></v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex
          v-for="(f, index) in sortedFinance"
          :key="f.annee"
          pa-1
          xs12
          sm6
          md4
          lg4
        >
          <v-card
    outline
    class="elevation-2">
            <v-card-title style="background-color: #dde;" class="subheading font-weight-bold">Ratios financiers de l'exercice {{ f.exercice + ' ' + mois(f.nombreMois)}}</v-card-title>
            <v-divider></v-divider>
            <v-list subheader>
              <v-subheader>Ratios financiers clés</v-subheader>
              <v-list-tile>
                <v-list-tile-content>Endettement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.endettement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.endettement, f.ratios.structureLiquidite.endettement) }}</v-icon></v-list-tile-content>
                <Help titre="Endettement">
                  <template>
                    <div>
                      <div class="fraction">
                        <div class="numerateur">Dettes de caractère financier</div>
                        <div>Ressources durables</div>
                      </div>
                      x 100
                    </div>
                  </template>
                </Help>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Autonomie financière&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.autonomieFinanciere }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.autonomieFinanciere, f.ratios.structureLiquidite.autonomieFinanciere) }}</v-icon></v-list-tile-content>
                <Help titre="Autonomie financière">
                  <template>
                    <div>
                      <div class="fraction">
                        <div class="numerateur">Fonds propres</div>
                        <div>Total bilan</div>
                      </div>
                      x 100
                    </div>
                  </template>
                </Help>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Liquidité réduite&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.liquiditeReduite }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.liquiditeReduite, f.ratios.structureLiquidite.liquiditeReduite) }}</v-icon></v-list-tile-content>
                <Help titre="Liquidité réduite">
                  <template>
                    <div>
                      <div class="fraction">
                        <div class="numerateur">Actif circulant net hors stocks</div>
                        <div>Dettes à court terme</div>
                      </div>
                    </div>
                  </template>
                </Help>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Rentabilité nette&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rentabiliteNette }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rentabiliteNette, f.ratios.productiviteRentabilite.rentabiliteNette) }}</v-icon></v-list-tile-content>
                <Help titre="Rentabilité nette">
                  <template>
                    <div>
                        <div class="fraction">
                          <div class="numerateur">Bénéfice ou perte</div>
                          <div>Chiffre d'affaires net + Subventions d'exploitation</div>
                        </div>
                        x 100
                    </div>
                  </template>
                </Help>
              </v-list-tile>
              <v-list-group>
                <v-subheader slot="activator" @click="trackMatomoEvent('etablissement', 'ratios_categorie_structure_et_liquidite', siret, f.exercice)">Structure et liquidité</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>Équilibre financier&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.equilibreFinancier }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.equilibreFinancier, f.ratios.structureLiquidite.equilibreFinancier) }}</v-icon></v-list-tile-content>
                  <Help titre="Équilibre financier">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Ressources durables</div>
                          <div>Emplois stables</div>
                        </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Indépendance financière&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.independanceFinanciere }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.independanceFinanciere, f.ratios.structureLiquidite.independanceFinanciere) }}</v-icon></v-list-tile-content>
                  <Help titre="Indépendance financière">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Fonds propres</div>
                          <div>Ressources durables</div>
                        </div>
                        x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Endettement&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.endettement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.endettement, f.ratios.structureLiquidite.endettement) }}</v-icon></v-list-tile-content>
                  <Help titre="Endettement">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Dettes de caractère financier</div>
                          <div>Ressources durables</div>
                        </div>
                        x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Autonomie financière&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.autonomieFinanciere }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.autonomieFinanciere, f.ratios.structureLiquidite.autonomieFinanciere) }}</v-icon></v-list-tile-content>
                  <Help titre="Autonomie financière">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Fonds propres</div>
                          <div>Total bilan</div>
                        </div>
                        x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Degré d'amortissements des immobilisations corporelles&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.degreImmoCorporelle }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.degreImmoCorporelle, f.ratios.structureLiquidite.degreImmoCorporelle) }}</v-icon></v-list-tile-content>
                  <Help titre="Degré d'amortissements des immobilisations corporelles">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Amortissements des immobilisations corporelles</div>
                          <div>Immobilisation corporelles brutes</div>
                        </div>
                        x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Financement de l'actif circulant net&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.financementActifCirculant }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.financementActifCirculant, f.ratios.structureLiquidite.financementActifCirculant) }}</v-icon></v-list-tile-content>
                  <Help titre="Financement de l'actif circulant net">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Fonds de roulement net global</div>
                          <div>Actif circulant net</div>
                        </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Liquidité générale&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.liquiditeGenerale }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.liquiditeGenerale, f.ratios.structureLiquidite.liquiditeGenerale) }}</v-icon></v-list-tile-content>
                  <Help titre="Liquidité générale">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Actif circulant net</div>
                          <div>Dettes à court terme</div>
                        </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Liquidité réduite&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.structureLiquidite.liquiditeReduite }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.structureLiquidite.liquiditeReduite, f.ratios.structureLiquidite.liquiditeReduite) }}</v-icon></v-list-tile-content>
                  <Help titre="Liquidité réduite">
                    <template>
                      <div>
                        <div class="fraction">
                          <div class="numerateur">Actif circulant net hors stocks</div>
                          <div>Dettes à court terme</div>
                        </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
              </v-list-group>
              <v-list-group>
                <v-subheader slot="activator" @click="trackMatomoEvent('etablissement', 'ratios_categorie_gestion', siret, f.exercice)">Gestion</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>Rotation des stocks&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.rotationStocks }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.rotationStocks, f.ratios.gestion.rotationStocks) }}</v-icon></v-list-tile-content>
                  <Help titre="Rotation des stocks">
                    <template>
                      <div>
                        <div class="mb-3">
                          <div class="fraction">
                            <div class="numerateur">Stock</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 360
                        </div>
                        <div class="mb-3">
                          Selon la nomenclature NAF Rév. 2 pour les secteurs d'activité 45, 46, 47, 95 (sauf 9511Z) ainsi que pour les codes d'activités 2319Z, 3831Z et 3832Z :
                          <div class="fraction">
                            <div class="numerateur">Marchandises</div>
                            <div>Achats de marchandises + Variation de stock</div>
                          </div>
                          x 360
                        </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Crédit clients&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.creditClient }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.creditClient, f.ratios.gestion.creditClient) }}</v-icon></v-list-tile-content>
                  <Help titre="Crédit clients">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Clients + Effets portés à l'escompte et non échus</div>
                            <div>Chiffre d'affaires TTC</div>
                          </div>
                          x 360
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Crédit fournisseurs&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.creditFournisseur }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.creditFournisseur, f.ratios.gestion.creditFournisseur) }}</v-icon></v-list-tile-content>
                  <Help titre="Crédit fournisseurs">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Fournisseurs</div>
                            <div>Achats TTC</div>
                          </div>
                          x 360
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>CA par effectif&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.caParEffectif }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.caParEffectif, f.ratios.gestion.caParEffectif) }}</v-icon></v-list-tile-content>
                  <Help titre="CA par effectif">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Chiffre d'affaires net</div>
                            <div>Effectif</div>
                          </div>
                          x 1000
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Taux d'intérêt financier&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.tauxInteretFinancier }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.tauxInteretFinancier, f.ratios.gestion.tauxInteretFinancier) }}</v-icon></v-list-tile-content>
                  <Help titre="Taux d'intérêt financier">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Intérêts</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Intérêts / Chiffre d'affaires&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.tauxInteretSurCa }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.tauxInteretSurCa, f.ratios.gestion.tauxInteretSurCa) }}</v-icon></v-list-tile-content>
                  <Help titre="Intérêts / Chiffre d'affaires">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Total des charges financières</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Endettement global&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.endettementGlobal }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.endettementGlobal, f.ratios.gestion.endettementGlobal) }}</v-icon></v-list-tile-content>
                  <Help titre="Endettement global">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Dettes + Effets portés à l'escompte et non échus</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 360
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Taux d'endettement&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.tauxEndettement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.tauxEndettement, f.ratios.gestion.tauxEndettement) }}</v-icon></v-list-tile-content>
                  <Help titre="Taux d'endettement">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Dettes de caractère financier</div>
                            <div>Capitaux propres + autres fonds propres</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Capacité de remboursement&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.capaciteRemboursement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.capaciteRemboursement, f.ratios.gestion.capaciteRemboursement) }}</v-icon></v-list-tile-content>
                  <Help titre="Capacité de remboursement">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Dettes de caractère financier</div>
                            <div>Capacité d'autofinancement avant répartition</div>
                          </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Capacité d'autofinancement&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.capaciteAutofinancement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.capaciteAutofinancement, f.ratios.gestion.capaciteAutofinancement) }}</v-icon></v-list-tile-content>
                  <Help titre="Capacité d'autofinancement">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Capacité d'autofinancement avant répartition</div>
                            <div>Chiffre d'affaires net + Subvention d'exploitation</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Couverture du CA par le FRNG&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.couvertureCaFdr }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.couvertureCaFdr, f.ratios.gestion.couvertureCaFdr) }}</v-icon></v-list-tile-content>
                  <Help titre="Couverture du CA par le FRNG">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Fonds de roulement net global</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 360
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Couverture du CA par le BFR&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.couvertureCaBesoinFdr }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.couvertureCaBesoinFdr, f.ratios.gestion.couvertureCaBesoinFdr) }}</v-icon></v-list-tile-content>
                  <Help titre="Couverture du CA par le BFR">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Besoins en fonds de roulement</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 360
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Poids des BFR d'exploitation&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.poidsBfrExploitation }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.poidsBfrExploitation, f.ratios.gestion.poidsBfrExploitation) }}</v-icon></v-list-tile-content>
                  <Help titre="Couverture du CA par le BFR">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Besoins en fonds de roulement d'exploitation</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Exportation&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.gestion.exportation }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.gestion.exportation, f.ratios.gestion.exportation) }}</v-icon></v-list-tile-content>
                  <Help titre="Exportation">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Chiffre d'affaires net - Chiffre d'affaires net en France</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
              </v-list-group>
              <v-list-group>
                <v-subheader slot="activator" @click="trackMatomoEvent('etablissement', 'ratios_categorie_productivite_et_rentabilite', siret, f.exercice)">Productivité et rentabilité</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>Efficacité économique&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.efficaciteEconomique }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.efficaciteEconomique, f.ratios.productiviteRentabilite.efficaciteEconomique) }}</v-icon></v-list-tile-content>
                  <Help titre="Efficacité économique">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Valeur ajoutée</div>
                            <div>Effectif</div>
                          </div>
                          x 1000
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Productivité du potentiel de production&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.productivitePotentielProduction }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.productivitePotentielProduction, f.ratios.productiviteRentabilite.productivitePotentielProduction) }}</v-icon></v-list-tile-content>
                  <Help titre="Productivité du potentiel de production">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Valeur ajoutée</div>
                            <div>Immobilisations corporelles et incorporelles brutes</div>
                          </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Productivité du capital financier&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.productiviteCapitalFinancier }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.productiviteCapitalFinancier, f.ratios.productiviteRentabilite.productiviteCapitalFinancier) }}</v-icon></v-list-tile-content>
                  <Help titre="Productivité du capital financier">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Valeur ajoutée</div>
                            <div>Actif circulant net + Effets portés à l'escompte et non échus</div>
                          </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Productivité du capital investi&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.productiviteCapitalInvesti }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.productiviteCapitalInvesti, f.ratios.productiviteRentabilite.productiviteCapitalInvesti) }}</v-icon></v-list-tile-content>
                  <Help titre="Productivité du capital investi">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Valeur ajoutée</div>
                            <div>Total de l'actif + Effets portés à l'escompte et non échus</div>
                          </div>
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Taux d'investissement productif&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.tauxDInvestissementProductif }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.tauxDInvestissementProductif, f.ratios.productiviteRentabilite.tauxDInvestissementProductif) }}</v-icon></v-list-tile-content>
                  <Help titre="Taux d'investissement productif">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Immobilisations à valeur d'acquisition</div>
                            <div>Valeur ajoutée</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Rentabilité économique&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rentabiliteEconomique }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rentabiliteEconomique, f.ratios.productiviteRentabilite.rentabiliteEconomique) }}</v-icon></v-list-tile-content>
                  <Help titre="Rentabilité économique">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Excédent brut d'exploitation</div>
                            <div>Chiffre d'affaires net + Subventions d'exploitation</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Performance&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.performance }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.performance, f.ratios.productiviteRentabilite.performance) }}</v-icon></v-list-tile-content>
                  <Help titre="Performance">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Résultat courant avant impôt</div>
                            <div>Chiffre d'affaires net + Subventions d'exploitation</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Rendement brut des fonds propres nets&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rendementBrutFondsPropres }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rendementBrutFondsPropres, f.ratios.productiviteRentabilite.rendementBrutFondsPropres) }}</v-icon></v-list-tile-content>
                  <Help titre="Rendement brut des fonds propres nets">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Résultat courant avant impôt</div>
                            <div>Fonds propres nets</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Rentabilité nette&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rentabiliteNette }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rentabiliteNette, f.ratios.productiviteRentabilite.rentabiliteNette) }}</v-icon></v-list-tile-content>
                  <Help titre="Rentabilité nette">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Bénéfice ou perte</div>
                            <div>Chiffre d'affaires net + Subventions d'exploitation</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Rendement des capitaux propres nets&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rendementCapitauxPropres }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rendementCapitauxPropres, f.ratios.productiviteRentabilite.rendementCapitauxPropres) }}</v-icon></v-list-tile-content>
                  <Help titre="Rendement des capitaux propres nets">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Bénéfice ou perte</div>
                            <div>Capitaux propres nets</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Rendement des ressources durables nettes&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.productiviteRentabilite.rendementRessourcesDurables }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.productiviteRentabilite.rendementRessourcesDurables, f.ratios.productiviteRentabilite.rendementRessourcesDurables) }}</v-icon></v-list-tile-content>
                  <Help titre="Rendement des ressources durables nettes">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Résultat courant avant impôts + Intérêts et charges assimilées</div>
                            <div>Ressources durables nettes</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
              </v-list-group>
              <v-list-group>
                <v-subheader slot="activator" @click="trackMatomoEvent('etablissement', 'ratios_categorie_marge_et_valeur_ajoutee', siret, f.exercice)">Marge et valeur ajoutée</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>Taux de marge commerciale&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.tauxMargeCommerciale }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.tauxMargeCommerciale, f.ratios.margeValeurAjoutee.tauxMargeCommerciale) }}</v-icon></v-list-tile-content>
                  <Help titre="Taux de marge commerciale">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Marge commerciale</div>
                            <div>Vente de marchandises</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Taux de valeur ajoutée&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.tauxValeurAjoutee }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.tauxValeurAjoutee, f.ratios.margeValeurAjoutee.tauxValeurAjoutee) }}</v-icon></v-list-tile-content>
                  <Help titre="Taux de valeur ajoutée">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Valeur ajoutée</div>
                            <div>Chiffre d'affaires net</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Part des salariés&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.partSalaries }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.partSalaries, f.ratios.margeValeurAjoutee.partSalaries) }}</v-icon></v-list-tile-content>
                  <Help titre="Part des salariés">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Charges de personnel + Participation des salariés aux résultats</div>
                            <div>Valeur ajoutée</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Part de l'État&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.partEtat }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.partEtat, f.ratios.margeValeurAjoutee.partEtat) }}</v-icon></v-list-tile-content>
                  <Help titre="Part de l'État">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Impôts et taxes</div>
                            <div>Valeur ajoutée</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Part des prêteurs&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.partPreteur }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.partPreteur, f.ratios.margeValeurAjoutee.partPreteur) }}</v-icon></v-list-tile-content>
                  <Help titre="Part des prêteurs">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Intérêts</div>
                            <div>Valeur ajoutée</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Part de l'autofinancement&nbsp;:</v-list-tile-content>
                  <v-list-tile-content class="valeur">{{ f.ratios.margeValeurAjoutee.partAutofinancement }} <v-icon v-if="index > 0">trending_{{ trend(sortedFinance[index-1].ratios.margeValeurAjoutee.partAutofinancement, f.ratios.margeValeurAjoutee.partAutofinancement) }}</v-icon></v-list-tile-content>
                  <Help titre="Part de l'autofinancement">
                    <template>
                      <div>
                          <div class="fraction">
                            <div class="numerateur">Capacité d'autofinancement avant répartition</div>
                            <div>Valeur ajoutée</div>
                          </div>
                          x 100
                      </div>
                    </template>
                  </Help>
                </v-list-tile>
              </v-list-group>
            </v-list>
            <div class="pb-3 text-xs-center" v-if="documentsComptablesDisponibles(f.exercice)">
              <v-btn color="indigo darken-5" @click="getBilansDocuments(index, f.exercice)" :dark="!loading(index)" :loading="loading(index)" :disabled="loading(index)"><v-icon left>mdi-cloud-download</v-icon> Télécharger les documents comptables de {{ f.exercice }}</v-btn>
              <v-alert :value="alert(index)" type="error" transition="scale-transition">Un problème est survenu lors du téléchargement des documents comptables.</v-alert>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import axios from 'axios'

export default {
  name: 'Finance',
  props: ['finance', 'siret'],
  components: { Help },
  data() {
    return {
      axios: axios.create(),
      loading0: false,
      loading1: false,
      loading2: false,
      alert0: false,
      alert1: false,
      alert2: false,
      bilansExercices: null,
    }
  },
  created() {
    if (process.env.VUE_APP_BILANS_ENABLED && !!JSON.parse(process.env.VUE_APP_BILANS_ENABLED)) {
      this.getBilansExercices()
    }
  },
  methods: {
    loading(l) {
      return this['loading' + l]
    },
    alert(l) {
      return this['alert' + l]
    },
    loader(l) {
      this['loading' + l] = true
      setTimeout(() => {
        this['loading' + l] = false
      }, 3000)
    },
    barOptions() {
      return {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: true,
          showForZeroSeries: true,
        },
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'barFinance',
        },
        xaxis: {
          type: 'category',
          categories: this.exercices,
        },
        yaxis: {
          title: {
            text: 'k€ (milliers d\'euros)',
          },
          labels: {
            formatter(val, index) {
              return val.toFixed(0)
            },
          },
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#4f8a83',
            shadeTo: 'light',
            shadeIntensity: 1,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            colors: {
              ranges: [{
                from: -Infinity,
                to: 0,
                color: '#e76278',
              }],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        tooltip: {
          enabled: true,
          y: {
            formatter(val) {
              return parseFloat(val.toFixed(2)).toLocaleString() + ' k€'
            },
          },
        },
        noData: {
          text: 'Il n\'y a pas de données associées',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
        },
      }
    },
    sortFinance() {
      return (this.finance || [])
        .sort((f1, f2) => (f2.annee > f1.annee ? -1 : 1))
        .filter((f) => f.exercice)
        .slice(-3)
    },
    trend(oldRatio, newRatio) {
      const variationThreshold = 0.10
      const oldRatioNumber = parseFloat(oldRatio.replace(',', '.'))
      const newRatioNumber = parseFloat(newRatio.replace(',', '.'))
      const diff = newRatioNumber - oldRatioNumber
      const variation = diff / Math.abs(oldRatioNumber)
      if (variation > variationThreshold) {
        return 'up'
      } else if (variation < -variationThreshold) {
        return 'down'
      } else {
        return 'flat'
      }
    },
    mois(m) {
      return m ? '(' + m + ' mois)' : ''
    },
    getBilansDocuments(l, exercice) {
      this.trackMatomoEvent('etablissement', 'telecharger_documents_comptables', this.siret, exercice)
      this['loading' + l] = true
      this['alert' + l] = false
      this.$axios.get('/bilans/130006018/2018', {responseType: 'blob'}).then((response) => {
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        const filename = response.headers['content-disposition'].split('filename=')[1]
        if (filename) {
          link.setAttribute('download', filename)
        }
        link.click()
        link.remove()
        this['loading' + l] = false
      }).catch((error) => {
        this['loading' + l] = false
        this['alert' + l] = true
      })
    },
    getBilansExercices() {
      this.$axios.get('/bilans/130006018').then((response) => {
        this.bilansExercices = response.data
      }).catch((error) => {
        this.bilansExercices = null
      })
    },
    documentsComptablesDisponibles(exercice) {
      if (this.bilansExercices) {
        return this.bilansExercices.indexOf(exercice) > -1
      } else {
        return false
      }
    },
  },
  computed: {
    sortedFinance() {
      return this.sortFinance()
    },
    annees() {
      return this.sortedFinance.map((f) => f.annee)
    },
    exercices() {
      return this.sortedFinance.map((f) => f.exercice)
    },
    sigOptions() {
      const title = {
        title: {
          text: 'Soldes Intermédiaires de Gestion (SIG)',
          align: 'center',
          margin: 0,
        },
      }
      return {...this.barOptions(), ...title}
    },
    tresorerieOptions() {
      const title = {
        title: {
          text: 'État de la trésorerie',
          align: 'center',
          margin: 0,
        },
      }
      return {...this.barOptions(), ...title}
    },
    sigSeries() {
      if (this.sortedFinance.length > 0) {
        return [{
          name: 'CA',
          data: this.sortedFinance.map((f) => parseInt(f.ca, 10)),
        }, {
          name: 'VA',
          data: this.sortedFinance.map((f) => f.va),
        }, {
          name: 'EBE',
          data: this.sortedFinance.map((f) => f.ebe),
        }, {
          name: 'REX',
          data: this.sortedFinance.map((f) => parseInt(f.resultatExpl, 10)),
        }, {
          name: 'RN',
          data: this.sortedFinance.map((f) => parseInt(f.beneficeOuPerte, 10)),
        }, {
          name: 'CAF',
          data: this.sortedFinance.map((f) => f.caf),
        }]
      } else {
        return []
      }
    },
    tresorerieSeries() {
      if (this.sortedFinance.filter((f) => f.frng && f.bfr).length > 0) {
        return [{
          name: 'FRNG',
          data: this.sortedFinance.map((f) => (f.frng && f.bfr) ? f.frng : null),
        }, {
          name: 'BFR',
          data: this.sortedFinance.map((f) => (f.frng && f.bfr) ? f.bfr : null),
        }, {
          name: 'TN',
          data: this.sortedFinance.map((f) => (f.frng && f.bfr) ? f.tresorerie : null),
        }]
      } else {
        return []
      }
    },
    siren() {
      return this.siret.slice(0, 9)
    },
  },
}
</script>
<style scoped>

::v-deep .fraction {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

::v-deep .numerateur {
  border-bottom: 2px solid black;
}

.valeur {
  align-items: flex-end !important;
}

</style>