import PredictionWidget from '@/components/PredictionWidget.vue'
import Toolbar from '@/components/Toolbar.vue'
import Help from '@/components/Help.vue'
import labelColors from '@/assets/labels.json'

export default {
    name: 'Follow',
    components: {PredictionWidget, Toolbar, Help},
    data() {
        return {
            init: true,
            loading: false,
            follow: [],
            snackbar: true,
            exportXSLXLoading: false,
            exportDOCXLoading: false,
            menuSince: false,
            alertExport: false,
            since: null,
            zoneSuivi: [],
        }
    },
    mounted() {
        this.getFollowedEtablissements()
    },
    methods: {
        resetLabels(event) {
            this.labels = []
            this.getFollowedEtablissements()
            event.stopPropagation()
        },
        showFollowHelp() {
            this.$refs.followHelp.clickButton()
        },
        getFollowedEtablissements() {
            this.loading = true
            if (this.wekanUser) {
                this.$axios.post('/follow', this.params).then((response) => {
                    if (response.status === 200) {
                        this.follow = response.data
                    } else {
                        this.follow = []
                    }
                }).finally(() => {
                    this.init = false
                    this.loading = false
                    this.followStateChanged = false
                })
            } else {
                this.$axios.get('/follow').then((response) => {
                    if (response.status === 200) {
                        this.follow = response.data
                    } else {
                        this.follow = []
                    }
                }).finally(() => {
                    this.init = false
                    this.loading = false
                    this.followStateChanged = false
                })
            }
        },
        openLeftDrawer() {
            this.trackMatomoEvent('general', 'ouvrir_menu')
            this.leftDrawer = !this.leftDrawer
        },
        openRightDrawer() {
            this.rightDrawer = true
        },
        closeRightDrawer() {
            this.rightDrawer = false
        },
        download(response, defaultFilename) {
            const blob = new Blob([response.data])
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            const filename = response.headers['content-disposition'] ? response.headers['content-disposition'].split('filename=')[1] : defaultFilename
            if (filename) {
                link.setAttribute('download', filename)
            }
            link.click()
            link.remove()
        },
        exportXSLX() {
            this.trackMatomoEvent('suivi', 'extraire', 'xlsx')
            this.exportXSLXLoading = true
            this.alertExport = false
            this.$axios.post('/export/xlsx/follow', this.params, {
                responseType: 'blob',
                timeout: 120000
            }).then((response) => {
                this.download(response, 'export-suivi.xlsx')
                this.exportXSLXLoading = false
            }).catch((_) => {
                this.exportXSLXLoading = false
                this.alertExport = true
            })
        },
        exportDOCX() {
            this.trackMatomoEvent('suivi', 'extraire', 'docx')
            this.exportDOCXLoading = true
            this.alertExport = false
            this.$axios.post('/export/docx/follow', this.params, {
                responseType: 'blob',
                timeout: 120000
            }).then((response) => {
                this.download(response, 'export-suivi.zip')
                this.exportDOCXLoading = false
            }).catch((_) => {
                this.exportDOCXLoading = false
                this.alertExport = true
            })
        },
        sortSelect(i1, i2) {
            return (i1.text < i2.text) ? -1 : 1
        }
    },
    computed: {
        params() {
            const params = {}
            params.type = this.type
            if (!this.statut.includes('*')) {
                params.statut = this.statut
            }
            if (!this.boards.includes('*')) {
                params.boards = this.boards
            }
            if (!this.zone.includes('*')) {
                params.zone = this.zone
            }
            params.labelMode = this.labelMode
            if (this.labels.length > 0) {
                params.labels = this.labels
            }
            if (this.since) {
                params.since = new Date(this.since)
            }
            return params
        },
        etablissements() {
            return this.follow.map((f) => f.etablissementSummary)
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
                return this.$store.state.followRightDrawer && this.wekanUser
            },
            set(val) {
                this.$store.dispatch('setFollowRightDrawer', val)
            },
        },
        wekan_url() {
            return process.env.VUE_APP_WEKAN_URL
        },
        type: {
            get() {
                return this.$localStore.state.typeSuivi
            },
            set(value) {
                this.$localStore.commit('setTypeSuivi', value)
            },
        },
        boards: {
            get() {
                const boardsSuivi = this.$localStore.state.boardsSuivi
                return (boardsSuivi.includes('*')) ? ['*'] : boardsSuivi
            },
            set(value) {
                this.$localStore.commit('setBoardsSuivi', (value.includes('*')) ? ['*'] : value)
            },
        },
        statut: {
            get() {
                const statutSuivi = this.$localStore.state.statutSuivi
                return (statutSuivi.includes('*')) ? ['*'] : statutSuivi
            },
            set(value) {
                this.$localStore.commit(
                    'setStatutSuivi',
                    (value.includes('*')) ? ['*'] : value
                )
            },
        },
        zone: {
            get() {
                const zoneSuivi = this.$localStore.state.zoneSuivi
                return (zoneSuivi.includes('*')) ? ['*'] : zoneSuivi
            },
            set(value) {
                this.$localStore.commit(
                    'setZoneSuivi',
                    (value.includes('*')) ? ['*'] : value
                )
            },
        },
        labels: {
            get() {
                return this.$localStore.state.labelsSuivi
            },
            set(value) {
                this.$localStore.commit('setLabelsSuivi', value)
            },
        },
        labelMode: {
            get() {
                return this.$localStore.state.labelModeSuivi
            },
            set(value) {
                this.$localStore.commit('setLabelModeSuivi', value)
            },
        },
        zoneItems() {
            const departements = Object.entries(this.$store.state.kanbanConfig.departements)
            const swimlanes = departements.filter(
                ([_, boards]) => {
                    for (const b of boards) {
                        if (this.boards.includes(b.boardID) || this.boards.includes('*')) {
                            return true
                        }
                    }
                    return false
                })
            const zoneItems = swimlanes.map(z => {
                return {
                    text: `${z[0]} - ${this.departements[z[0]]}`,
                    value: z[0],
                    short: `${this.departements[z[0]]}`,
                    disabled: this.zone.includes('*'),
                }
            }).sort((z1, z2) => (z1.text < z2.text) ? -1 : 1)

            return [{text: 'Tous les départements', value: '*', short: 'Tout'}].concat(zoneItems)
        },
        departements() {
            return this.$store.state.departements
        },
        wekanUser() {
            return this.roles.includes('wekan')
        },
        boardsItems() {
            const boards = Object.entries(this.$store.state.kanbanConfig.boards)
            const all = [
                {
                    text: 'Tous les tableaux',
                    value: '*',
                },
            ]
            return all.concat(boards.map(([k, b]) => {
                return {
                    value: k,
                    text: b.title.slice(8),
                    disabled: (this.boards.includes('*')),
                }
            }).sort(this.sortSelect))
        },
        labelItems() {
            const boards = Object
                .entries(this.$store.state.kanbanConfig.boards)
                .filter(([boardID, _]) => (this.boards.includes(boardID) || this.boards.includes('*')))
            const labels = boards.reduce((m, [_, board]) => {
                Object.entries(board.labels).forEach(([_, label]) => {
                    if (label.name !== '') {
                        m[label.name] = labelColors[label.color]
                    }
                })
                return m
            }, {})
            return Object.entries(labels).map(([name, color]) => {
                return {
                    text: name,
                    background: color.background,
                    front: color.front,
                    value: name,
                }
            }).sort((label1, label2) => {
                return (label1.background + label1.name < label2.background + label2.name) ? -1 : 1
            })
        },
        statutItems() {
            const boards = Object
                .entries(this.$store.state.kanbanConfig.boards)
                .filter(([boardID, _]) => (this.boards.includes(boardID) || this.boards.includes('*')))
            const dupItems = boards
                .flatMap(([_, board]) => {
                    return Object.values(board.lists)
                        .sort((list1, list2) => {
                            return (list1.sort < list2.sort) ? -1 : 1
                        })
                        .map((list) => {
                            return list.title
                        })
                })
            const items = dupItems
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((item) => {
                    return {
                        text: item,
                        disabled: (this.statut.includes('*')),
                    }
                })
            const all = [
                {
                    text: 'Tous les statuts',
                    value: '*',
                },
            ]
            return all.concat(items)
        },
    },
    filters: {
        pluralizeEtablissement(count) {
            if (count === 1) {
                return '1 établissement'
            } else {
                return count + ' établissements'
            }
        },
    },
}