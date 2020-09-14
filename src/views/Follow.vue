<template>
    <div>
        <Toolbar title="Suivi d'établissements" drawer/>
        <div id="nodata" v-if="!loading && follow.length == 0 && init == false">
            Vous ne suivez pour le moment aucun établissement.<br>Pour ce faire, rendez-vous sur la fiche d'un établissement et appuyez sur le bouton Suivre.
        </div>
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
            init: true,
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
                if (response.status === 200) {
                    this.follow = response.data
                }
            }).finally(() => {
                this.init = false
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

<style scoped>
#nodata {
  width: 80%;
  max-width: 100%;
  height: 400px;
  margin: 200px 10%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
  font-size: 40px;
}
</style>