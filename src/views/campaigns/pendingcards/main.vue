<template>
  <div>
    <Card v-for="etablissement in pending.etablissements" :key="etablissement.siret">
        <template v-slot:entete>
          <div>
            <div v-if="etablissement.followed" class="corner-ribbon"><v-icon dark small>mdi-star</v-icon></div>
            <ScoreWidget :prediction="etablissement" :key="etablissement.id" :tooltip="true"/>
          </div>
        </template>
        <template v-slot:corps>
            <div class="ml-4">
                <span class="raison-sociale">
                    {{ etablissement.raisonSociale }}
                </span><br/>
                <span>
                    {{ etablissement.siret }}
                </span>
            </div>
            <div style="text-align: right" class="mr-4">
                <v-btn color="indigo lighten-1" dark block small style="text-transform: none" class="mb-2" @click="showEtablissement(etablissement.siret)">Fiche Établissement</v-btn>
                <v-btn color="indigo lighten-1" dark block small  style="text-transform: none" @click="showEntreprise(etablissement.siret)">Fiche Entreprise</v-btn>
            </div>
            <div class="mr-4">
                <v-btn dark rounded color="green">
                    Je m'en charge
                </v-btn>
            </div>
        </template>
    </Card>
    <v-dialog fullscreen v-model="dialogEtablissement">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer/>FICHE ETABLISSEMENT<v-spacer/>
                <v-icon @click="hideEtablissement()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement v-if="dialogEtablissement" :siret="this.siret"></Etablissement>
        </div>
    </v-dialog>
    <v-dialog fullscreen v-model="dialogEntreprise">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer />FICHE ENTREPRISE
                <v-spacer />
                <v-icon @click="hideEntreprise()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Entreprise v-if="dialogEntreprise" :siren="this.siren"/>
        </div>
    </v-dialog>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>