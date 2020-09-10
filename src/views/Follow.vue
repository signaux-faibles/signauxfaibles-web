<template>
    <div>
        <Toolbar title="Suivi d'établissements" drawer/>
        <PredictionWidget v-for="e in etablissements" :key="e.siret" :prediction="e" />
    </div>
</template>
<script>
import PredictionWidget from '@/components/PredictionWidget'
import Toolbar from '@/components/Toolbar'

export default {
    components: { PredictionWidget, Toolbar },
    data() {
        return {
            loading: false,
            follow: [],
        }
    },
    mounted() {
        this.getFollowedEtablissements()
    },
    methods: {
        getFollowedEtablissements() {
            this.$axios.get('/follow').then((response) => {
                this.follow = response.data
            })
        },
    },
    computed: {
        etablissements() {
            return this.follow.map((f) => f.etablissements)
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
    },
}
</script>
