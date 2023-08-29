import Help from '@/components/Help.vue'
import Gitbook from "@/components/Gitbook.vue";

function customTooltipFPI(fournisseurs, encours, dateString, experiencesPaiement, fpi00, fpi30_90, fpi90) {
    return `` +
        `<div class="customTooltipTitle"><span class="apexcharts-tooltip-text-y-label">${dateString}</span></div>` +
        `<div class="customTooltipBody">` +
        `${fpi00}% des paiements avant 30 jours de retard<br/>` +
        `${fpi30_90}% des paiements entre 30 et 90 jours de retard<br/>` +
        `${fpi90}% des paiements après 90 jours de retard<br style="margin-bottom: 10px"/>` +
        `<b>contexte:<br/></b><ul>` +
        `<li>${(experiencesPaiement) ? experiencesPaiement + ' paiements' : 'paiements: non connu'}</li>` +
        `<li>${(fournisseurs) ? fournisseurs + ' fournisseurs' : 'fournisseurs: non connu'}</li>` +
        `<li>${(encours) ? Math.round(encours) + '€ d\'encours fournisseurs' : 'encours fournisseurs: non connu'}</li><ul/>` +
        `</div>`
}

export default {
    name: 'Paiement',
    props: ['siren', 'paydex'],
    components: {Gitbook, Help},
    data() {
        return {
            tiers: [0, 15, 30, 60],
            variationThresholds: [0.1, 0.25, 0.5],
        }
    },
    methods: {
        average(array) {
            const total = array.reduce((acc, c) => acc + c, 0)
            return total / array.length
        },
        offset(value) {
            return Math.round(100 * (1 - value / this.maxRetard))
        }
    },
    computed: {
        seriesFPI() {
            if (this.paydex) {
                return [{
                    name: 'moins de 30 jours',
                    data: this.paydex.fpi30.map((p) => {
                        return 100 - p
                    }),
                    fournisseurs: this.paydex.fournisseurs,
                    encours: this.paydex.encours,
                    experiencesPaiement: this.paydex.experiencesPaiement,
                },
                    {
                        name: 'entre 30 et 90 jours',
                        data: this.paydex.fpi30.map((p, i) => {
                            return p - this.paydex.fpi90[i]
                        }),
                    }, {
                        name: 'plus de 90 jours',
                        data: this.paydex.fpi90,
                    }]
            } else {
                return []
            }
        },
        optionsFPI() {
            return {

                colors: ['#4f8a83', '#fac699', '#e76278'],
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: true,
                    showForSingleSeries: false,
                    showForNullSeries: false,
                    showForZeroSeries: false,
                },
                tooltip: {
                    custom: function ({series, seriesIndex, dataPointIndex, w}) {

                        const fournisseur = (w.config.series[0].fournisseurs || {})[dataPointIndex]
                        const encours = w.config.series[0].encours[dataPointIndex]
                        const experiencesPaiement = w.config.series[0].experiencesPaiement[dataPointIndex]
                        const fpi00 = w.config.series[0].data[dataPointIndex]
                        const fpi30_90 = w.config.series[1].data[dataPointIndex]
                        const fpi90 = w.config.series[2].data[dataPointIndex]
                        const date = new Date(w.config.xaxis.categories[dataPointIndex])
                        const dateString = ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' + date.getUTCFullYear()
                        return customTooltipFPI(fournisseur, encours, dateString, experiencesPaiement, fpi00, fpi30_90, fpi90)
                    },
                },
                theme: {
                    mode: 'light',
                    palette: 'palette7',
                },
                chart: {
                    stacked: true,
                    stackType: "100%",
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                    id: 'répartition des paiement',
                },
                xaxis: {
                    type: 'datetime',
                    categories: this.dateValeur
                },
                yaxis: {
                    min: 0,
                    title: {
                        text: 'répartition en %',
                    }
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
        seriesJoursRetard() {
            if (this.paydex) {
                return [{
                    name: 'retards de paiement des fournisseurs',
                    data: this.paydex.joursRetard.reduce((data, c, i) => {
                        data.push([
                            new Date(this.paydex.dateValeur[i]),
                            Math.round(this.paydex.joursRetard[i]),
                        ])
                        return data
                    }, []),
                }]
            } else {
                return []
            }
        },
        dateValeur() {
            return (this.paydex)?this.paydex.dateValeur:[]
        },
        joursRetard() {
            return (this.paydex)?this.paydex.joursRetard:[]
        },
        maxRetard() {
            return Math.ceil(Math.max(...(this.joursRetard || [])) / 15) * 15
        },
        colorStops() {
            var stops = []

            if (this.maxRetard > 60) {
                stops.push({
                    offset: this.offset(60),
                    color: "#e76278",
                    opacity: 1
                })
            }

            if (this.maxRetard > 15) {
                stops.push({
                    offset: this.offset(10),
                    color: "#fac699",
                    opacity: 1
                })
            }

            stops.push(
                {
                    offset: this.offset(0),
                    color: "#4f8a83",
                    opacity: 1
                }
            )

            return stops
        },
        optionsJoursRetard() {
            return {
                annotations: {
                    yaxis: [
                        {
                            y: 8800,
                            borderColor: '#00E396',
                            label: {
                                borderColor: '#00E396',
                                style: {
                                    color: '#fff',
                                    background: '#00E396'
                                },
                                text: 'Y-axis annotation on 8800'
                            }
                        }
                    ]
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    showForNullSeries: false,
                    showForZeroSeries: false,
                },
                tooltip: {
                    enabled: true,
                    x: {
                        format: 'MM/yyyy',
                    },
                    y: {
                        formatter(val) {
                            return parseInt(val, 10) + ' jours'
                        },
                    },
                },
                theme: {
                    mode: 'light',
                    palette: 'palette7',
                },
                chart: {
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                    id: 'retards de paiement des fournisseurs',
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    min: 0,
                    max: this.maxRetard,
                    title: {
                        text: 'jours de retard',
                    },
                    labels: {
                        formatter(val, index) {
                            return val.toFixed(0)
                        },
                    },
                },
                colors: ['#4f8a83'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shade: 'dark',
                        gradientToColors: [ '#4f8a83'],
                        shadeIntensity: 1,
                        type: 'vertical',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100]
                    },
                },
                stroke: {
                    curve: ['smooth'],
                    width: [5],
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
        avg24m() {
            return (this.paydex.joursRetard.length > 0) ? this.average(this.paydex.joursRetard) : null
        },
        avg6m() {
            return (this.nbJours6m.length > 0) ? this.average(this.nbJours6m) : null
        },
        nbJours6m() {
            return this.paydex.joursRetard.reduce((nbJours6m, nbj, i) => {
                if (new Date(this.paydex.dateValeur[i]) >= this.date6m) {
                    nbJours6m = nbJours6m.concat(nbj)
                }
                return nbJours6m
            }, [])
        },
        date6m() {
            const date6m = new Date()
            date6m.setMonth(date6m.getMonth() - 6)
            date6m.setDate(1)
            date6m.setUTCHours(0, 0, 0)
            return date6m
        },
        variation() {
            if (this.avg6m != null) {
                const diff = this.avg6m - this.avg24m
                return diff / Math.abs(this.avg24m)
            } else {
                return null
            }
        },
    },
}
