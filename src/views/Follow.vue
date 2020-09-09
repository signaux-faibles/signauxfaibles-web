<template>
    <div>
        <v-toolbar
        height="35px"
        class="toolbar elevation-12"
        color="#ffffff"
        extension-height="48px"
        app
        >
        <v-icon
            @click="leftDrawer=!leftDrawer"
            class="fa-rotate-180"
            v-if="!leftDrawer"
            color="#ffffff"
            key="toolbar"
        >mdi-backburger</v-icon>

        <div
            style="width: 100%; text-align: center;"
            class="toolbar_titre"
        >Suivi d'entreprises</div>
        <v-spacer></v-spacer>
        <v-icon
            :class="loading?'rotate':''"
            color="#ffffff"
            v-if="!rightDrawer"
            @click="rightDrawer=!rightDrawer"
        >mdi-target</v-icon>
        </v-toolbar>
        <PredictionWidget v-for="e in etablissements" :key="e.siret" :prediction="e" />
    </div>
</template>
<script lang='ts'>
import PredictionWidget from '@/components/PredictionWidget'

type Score = {
    siren: string
    siret: string
    score?: number
    diff?: number
    raison_sociale: string
    commune: string
    libelle_activite: string
    libelle_activite_n1: string
    code_activite: string
    departement: string
    libelle_departement: string
    dernier_effectif?: number
    urssaf?: boolean
    activite_partielle?: boolean
    ca?: number
    variation_ca?: number
    arrete_bilan?: Date
    resultat_expl?: number
    etat_procol: string
    alert?: string
    visible: boolean
    inZone: boolean
    followed: boolean
}

type Follow = {
    siret: string
    username: string
    active: boolean
    since: Date
    comment: string
    etablissements: Score[]
}

export default {
    components: { PredictionWidget },
    data() {
        return {
            mister: 'tagada',
            follow: [] as Follow[],
        }
    },
    mounted() {
        this.getFollowedEntreprises()
    },
    methods: {
        getFollowedEntreprises() {
            this.$axios.get('/follow').then((r: any) => {
                this.follow = r.data as Follow[]
            })
        }
    },
    computed: {
        etablissements() {
            return this.follow.map(f => f.etablissements)
        },
    }
}
</script>
