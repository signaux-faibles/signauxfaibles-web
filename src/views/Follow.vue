<template>
    <div>
        <Toolbar title="Suivi d'entreprises" drawer/>
        <PredictionWidget v-for="e in etablissements" :key="e.siret" :prediction="e" />
    </div>
</template>
<script lang='ts'>
import PredictionWidget from '@/components/PredictionWidget'
import Toolbar from '@/components/Toolbar'

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
    components: { PredictionWidget, Toolbar },
    data() {
        return {
            loading: false,
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
        leftDrawer: {
            get() {
                return this.$store.state.leftDrawer
            },
            set(val) {
                this.$store.dispatch('setLeftDrawer', val)
            },
        },
        rightDrawer: {
            get() {
                return this.$store.state.rightDrawer
            },
            set(val) {
                this.$store.dispatch('setRightDrawer', val)
            },
        },
    }
}
</script>
