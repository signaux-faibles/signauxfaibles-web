<template>
  <div>
    <v-toolbar dark color="indigo">
      <v-toolbar-title class="localtoolbar">Informations sociales</v-toolbar-title>
      <v-spacer />
      <Help titre="Informations sociales">
        <template>
          <p>Cette rubrique fait la synthèse des informations sociales de l'entreprise.</p>
          <p>En premier lieu, vous trouvez l'effectif total de l'entreprise, la consommation moyenne en activité partielle sur les 12 derniers mois et le montant de la dernière dette sociale connue.</p>
          <p>Ensuite, l'ensemble des établissements de l'entreprise vous sont présentés sous forme de carte et sous forme de liste triée par effectif, activité partielle ou dette sociale.</p>
          <p>Vous avez également la possibilité de consulter l'historique de ces données, agrégées au niveau entreprise, sur les 24 derniers mois.</p>
          <p>Le premier graphique représente l'évolution des effectifs et de la consommation de l'activité partielle.<br><em>Fournisseur : ACOSS et DGEFP.</em></p>
          <p>Le second graphique représente l'évolution des montants des cotisations appelées et des dettes patronales et salariales.<br><em>Fournisseur : ACOSS.</em></p>
        </template>
      </Help>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap>
        <v-flex md6 xs12 grow>
          <v-layout column px-2 fill-height>
            <v-flex shrink>
              <v-layout row align-center class="resume">
                <v-flex text-xs-left class="valeur" style="line-height: 1.2em">
                  {{ etablissementActif() | pluralizeEtablissement }} en activité
                </v-flex>
                <v-flex text-xs-right shrink ml-3>
                  EFFECTIF
                  <div class="valeur">{{ effectifEntreprise }}</div>
                </v-flex>
                <v-flex v-if="permDGEFP" text-xs-right shrink ml-3>
                  ACT. PARTIELLE
                  <div class="valeur">{{ activitePartielleEntreprise }}</div>
                </v-flex>
                <v-flex v-if="permUrssaf" text-xs-right shrink ml-3>
                  DETTE SOC.
                  <div class="valeur">{{ detteSocialeEntreprise }}</div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex pt-3>
              <div
                id="entrepriseMap"
                style="min-height: 425px; height: 100%; border: 1px solid black"
              ></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex md6 xs12>
          <v-layout column fill-height style="font-weight: normal">
            <v-flex v-if="permDGEFP || permUrssaf" py-3 text-xs-center shrink>
              <v-btn-toggle mandatory v-model="sort">
                <v-btn flat value="effectif">Trié par effectif</v-btn>
                <v-btn v-if="permDGEFP" flat value="activite-partielle">Par activité partielle</v-btn>
                <v-btn v-if="permUrssaf" flat value="dette-sociale">Par dette sociale</v-btn>
              </v-btn-toggle>
            </v-flex>
            <v-flex px-2 grow>
              <div v-if="siegeEntreprise">
                <div class="pb-1 pt-2 pl-3 subheading">Siège social de l'entreprise</div>
                <PredictionWidget
                  :key="siegeEntreprise.siret"
                  :prediction="siegeEntreprise"
                  social="true"
                  :activitePartielle="derniereActivitePartielle[siegeEntreprise.siret]"
                  :detteSociale="derniereDetteSociale[siegeEntreprise.siret]"
                  @highlight-etablissement="highlightEtablissement(siegeEntreprise.siret)"
                  v-on="$listeners"
                  @hook:mounted="refreshMap()"
                />
              </div>
              <div v-if="autresEtablissements.length > 0">
                <div class="pb-1 pt-2 pl-3 subheading">Autres établissements</div>
                <PredictionWidget
                  v-for="e in paginate"
                  :key="e.siret"
                  :prediction="e"
                  social="true"
                  :activitePartielle="derniereActivitePartielle[e.siret]"
                  :detteSociale="derniereDetteSociale[e.siret]"
                  @highlight-etablissement="highlightEtablissement(e.siret)"
                  v-on="$listeners"
                />
              </div>
            </v-flex>
            <v-flex pt-2 text-xs-center align-end shrink>
              <v-pagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :length="totalPages"
                @input="changePage"
              />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout mt-4 wrap>
        <v-flex v-if="ecartEffectif >= 0" md6 xs12>
          <v-layout px-3 align-center style="min-height: 80px">
            <v-flex style="font-size: 16px">
              L'effectif de cette entreprise {{ introEffectif }}
              <span v-if="permDGEFP">
                et elle
                {{ hasActivitePartielle ? "a eu" : "n’a pas eu" }} recours à
                l'activité partielle
              </span>
              sur les 24 derniers mois.
            </v-flex>
            <v-flex md5 shrink>
              <v-btn outline color="indigo" @click="toggleHistoriqueEffectif" class="ml-4">
                {{
                showHistoriqueEffectif ? "Masquer" : "Afficher"
                }}
                l'historique
              </v-btn>
            </v-flex>
          </v-layout>
          <transition name="fade">
            <div v-if="showHistoriqueEffectif">
              <apexchart
                width="100%"
                heigth="100%"
                type="line"
                :options="effectifOptions"
                :series="effectifSeries"
             />
            </div>
          </transition>
        </v-flex>
        <v-flex v-if="permUrssaf" md6 xs12>
          <v-layout px-3 align-center style="min-height: 80px">
            <v-flex style="font-size: 16px">
              Cette entreprise
              {{
              hasDetteSociale
              ? "présente des impayés Urssaf"
              : "ne présente pas d’impayé Urssaf"
              }}
              sur les 24 derniers mois.
            </v-flex>
            <v-flex md5 shrink>
              <v-btn
                outline
                color="indigo"
                @click="toggleHistoriqueDetteSociale"
                class="ml-4"
              >
                {{
                showHistoriqueDetteSociale ? "Masquer" : "Afficher"
                }}
                l'historique
              </v-btn>
            </v-flex>
          </v-layout>
          <transition name="fade">
            <div v-if="showHistoriqueDetteSociale">
              <apexchart
                width="100%"
                heigth="100%"
                type="line"
                :options="urssafOptions"
                :series="urssafSeries"
              />
            </div>
          </transition>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import PredictionWidget from '@/components/PredictionWidget.vue'
import Map from '@/components/Etablissement/Map.vue'
import Help from '@/components/Help.vue'

export default {
  name: 'EntrepriseSocial',
  props: ['siren', 'etablissementsSummary', 'etablissements'],
  components: { Help, Map, PredictionWidget },
  data() {
    return {
      sort: 'effectif',
      siegeEntreprise: null,
      autresEtablissements: [],
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
      map: null,
      derniereActivitePartielle: {},
      derniereDetteSociale: {},
      showHistoriqueEffectif: false,
      showHistoriqueDetteSociale: false,
      markers: {},
      highlightedMarker: null,
      defaultMarkerColor: '#999999',
      highlightedColor: '#1976d2',
      currentPage: 1,
      itemsPerPage: 5,
      render: 0,
      bounds: null,
    }
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken
    this.map = new mapboxgl.Map({
      container: 'entrepriseMap',
      style: this.mapStyle,
    })
    const franceBounds = [-4.7681, 42.3288, 8.2581, 51.0858]
    this.map.fitBounds(franceBounds, { padding: 50 })
  },
  watch: {
    etablissementsSummary(val) {
      this.siegeEntreprise = null
      this.autresEtablissements = []
      val.forEach((e) => {
        if (e.siege === true) {
          this.siegeEntreprise = e
        } else {
          this.autresEtablissements.push(e)
        }
      })
      this.autresEtablissements.sort((e1, e2) => {
        return (e2.dernier_effectif > e1.dernier_effectif ? 1 : -1)
      })
    },
    etablissements(val) {
      this.bounds = new mapboxgl.LngLatBounds()
      let coordinates = null
      val.forEach((e) => {
        if ((e.sirene || {}).longitude && (e.sirene || {}).latitude) {
          const marker = new mapboxgl.Marker({ color: this.defaultMarkerColor })
          coordinates = [(e.sirene || {}).longitude, (e.sirene || {}).latitude]
          marker.setLngLat(coordinates)
          const summary = this.etablissementsSummary.filter((es) => es.siret === e.siret)[0]
          const html = 'ETS ' + summary.commune
            + (summary.dernier_effectif ? ('<br>' + this.pluralizeEffectif(summary.dernier_effectif)) : '')
          const popup = new mapboxgl.Popup({ closeButton: false })
          popup.setHTML(html)
          marker.setPopup(popup)
          marker.getElement().addEventListener('click', (event) => {
            event.stopPropagation()
            this.highlightEtablissement(e.siret)
          }, false)
          marker.addTo(this.map)
          this.markers[e.siret] = marker
          this.bounds.extend(coordinates)
        }
      })
      this.refreshMap()
      if (this.etablissements.length === 1) {
        this.map.setZoom(8)
        if (coordinates) {
          this.map.flyTo({ center: coordinates })
        }
      }
      this.highlightEtablissement(this.siegeEntreprise.siret)
    },
    sort(val) {
      this.autresEtablissements.sort((e1, e2) => {
        if (val === 'activite-partielle') {
          return ((e2.apHeureConsommeAVG12m || 0) > (e1.apHeureConsommeAVG12m || 0) ? 1 : -1)
        } else if (val === 'dette-sociale') {
          return (((e2.detteUrssaf === undefined) ? -1 : e2.detteUrssaf)
            > ((e1.detteUrssaf === undefined) ? -1 : e1.detteUrssaf) ? 1 : -1)
        } else {
          return (e2.dernier_effectif > e1.dernier_effectif ? 1 : -1)
        }
      })
    },
  },
  methods: {
    etablissementActif() {
      return this.etablissementsSummary.filter((e) => e.etatAdministratif === 'A').length
    },
    refreshMap() {
      this.map.resize()
      if (this.etablissements.length > 1) {
        this.map.fitBounds(this.bounds, { padding: 50 })
      }
    },
    equivalentTempsPlein(heures) {
      return heures / 151.67
    },
    formatActivitePartielle(activitePartielle) {
      return parseFloat(activitePartielle.toFixed(1)).toLocaleString() + '\u00A0ETP'
    },
    formatDetteSociale(detteSociale) {
      return parseFloat((detteSociale / 1000).toFixed(1)).toLocaleString() + '\u00A0k€'
    },
    pluralizeEffectif(count) {
      if (count === 1) {
        return '1 salarié'
      } else {
        return count + ' salariés'
      }
    },
    toggleHistoriqueEffectif() {
      this.showHistoriqueEffectif = !this.showHistoriqueEffectif
      if (this.showHistoriqueEffectif) {
        this.trackMatomoEvent('entreprise', 'afficher_historique_effectif', this.siren)
      } else {
        this.trackMatomoEvent('entreprise', 'masquer_historique_effectif', this.siren)
      }
    },
    toggleHistoriqueDetteSociale() {
      this.showHistoriqueDetteSociale = !this.showHistoriqueDetteSociale
      if (this.showHistoriqueDetteSociale) {
        this.trackMatomoEvent('entreprise', 'afficher_historique_dette_sociale', this.siren)
      } else {
        this.trackMatomoEvent('entreprise', 'masquer_historique_dette_sociale', this.siren)
      }
    },
    reinitAllMarkers() {
      Object.keys(this.markers).forEach((siret) => {
        const m = this.markers[siret]
        this.changeMarkerColor(m, this.defaultMarkerColor)
        const popup = m.getPopup()
        popup.remove()
      })
    },
    highlightEtablissement(siret) {
      const marker = this.markers[siret]
      if (marker && marker !== this.highlightedMarker) {
        this.reinitAllMarkers()
        this.changeMarkerColor(marker, this.highlightedColor)
        marker.togglePopup()
        this.highlightedMarker = marker
      }
    },
    changeMarkerColor(marker, color) {
      const element = marker.getElement()
      const icon = element.querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      icon.setAttribute('fill', color)
      marker._color = color
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber
    },
  },
  computed: {
    effectifEntreprise() {
      return this.etablissementsSummary.reduce((effectifEntreprise, e) => {
        if (e.etatAdministratif === 'A') {
          effectifEntreprise += e.dernier_effectif || 0
        }
        return effectifEntreprise
      }, 0) || 'n/c'
    },
    activitePartielleEntreprise() {
      return this.formatActivitePartielle(this.equivalentTempsPlein(
        this.etablissementsSummary.reduce((activitePartielleEntreprise, e) => {
          const derniereActivitePartielleEtablissement = e.apHeureConsommeAVG12m || 0
          return activitePartielleEntreprise + derniereActivitePartielleEtablissement
        }, 0)))
    },
    detteSocialeEntreprise() {
      return this.formatDetteSociale(this.etablissementsSummary.reduce((detteSocialeEntreprise, e) => {
        const derniereDetteSocialeEtablissement = e.detteUrssaf || 0
        return detteSocialeEntreprise + derniereDetteSocialeEtablissement
      }, 0))
    },
    historiqueEffectif() {
      return this.etablissements.reduce((historiqueEffectif, e) => {
        const periodeUrssaf = e.periodeUrssaf || {}
        const f = (periodeUrssaf.periodes || []).forEach((p, i) => {
          if (new Date(p) > this.minDate) {
            const effectif = periodeUrssaf.effectif[i]
            historiqueEffectif[p] = historiqueEffectif[p]
              + effectif
              || effectif
          }
        })
        return historiqueEffectif
      }, {})
    },
    maxDateEffectif() {
      return Object.keys(this.historiqueEffectif).reduce((maxDateEffectif, p) => {
        if (maxDateEffectif && new Date(maxDateEffectif) > new Date(p) || this.historiqueEffectif[p] == null) {
          return maxDateEffectif
        } else {
          return p
        }
      }, '')
    },
    minDateEffectif() {
      return Object.keys(this.historiqueEffectif).reduce((minDateEffectif, p) => {
        if (minDateEffectif && new Date(minDateEffectif) < new Date(p) || this.historiqueEffectif[p] == null) {
          return minDateEffectif
        } else {
          return p
        }
      }, '')
    },
    maxEffectif() {
      return Object.keys(this.historiqueEffectif).reduce((maxEffectif, p) => {
        if (maxEffectif.valeur > this.historiqueEffectif[p] || this.historiqueEffectif[p] == null) {
          return maxEffectif
        } else {
          return { periode: p, valeur: this.historiqueEffectif[p] }
        }
      }, 0)
    },
    minEffectif() {
      return Object.keys(this.historiqueEffectif).reduce((minEffectif, p) => {
        if (minEffectif.valeur < this.historiqueEffectif[p] || this.historiqueEffectif[p] == null) {
          return minEffectif
        } else {
          return { periode: p, valeur: this.historiqueEffectif[p] }
        }
      }, 0)
    },
    ecartEffectif() {
      return this.maxEffectif.valeur - this.minEffectif.valeur
    },
    hasActivitePartielle() {
      return Object.keys(this.historiqueActivitePartielle).some((d) => {
        return this.historiqueActivitePartielle[d] > 0
      })
    },
    hasDetteSociale() {
      return Object.keys(this.historiqueDetteSociale).some((d) => {
        return this.historiqueDetteSociale[d].partPatronale > 0 || this.historiqueDetteSociale[d].partSalariale > 0
      })
    },
    historiqueActivitePartielle() {
      return this.etablissements.reduce((historiqueActivitePartielle, e) => {
        const f = (e.apConso || []).forEach((ap) => {
          if (new Date(ap.date) > this.minDate) {
            const equivalentTempsPlein = this.equivalentTempsPlein(ap.heureConsomme)
            historiqueActivitePartielle[ap.date] = historiqueActivitePartielle[ap.date]
              + equivalentTempsPlein
              || equivalentTempsPlein
          }
        })
        return historiqueActivitePartielle
      }, {})
    },
    historiqueDetteSociale() {
      return this.etablissements.reduce((historiqueDetteSociale, e) => {
        const periodeUrssaf = e.periodeUrssaf || {}
        const f = (periodeUrssaf.periodes || []).forEach((p, i) => {
          if (new Date(p) > this.minDate) {
            if (!historiqueDetteSociale[p]) {
              historiqueDetteSociale[p] = {}
            }
            const cotisation = periodeUrssaf.cotisation[i]
            const partPatronale = periodeUrssaf.partPatronale[i]
            const partSalariale = periodeUrssaf.partSalariale[i]
            historiqueDetteSociale[p].cotisation = historiqueDetteSociale[p].cotisation
              + cotisation
              || cotisation
            historiqueDetteSociale[p].partPatronale = historiqueDetteSociale[p].partPatronale
              + partPatronale
              || partPatronale
            historiqueDetteSociale[p].partSalariale = historiqueDetteSociale[p].partSalariale
              + periodeUrssaf.partSalariale[i]
              || periodeUrssaf.partSalariale[i]
          }
        })
        return historiqueDetteSociale
      }, {})
    },
    effectifSeries() {
      if (Object.keys(this.historiqueEffectif).length > 0 || Object.keys(this.historiqueActivitePartielle).length > 0) {
        return [{
          name: 'consommation activité partielle',
          data: Object.keys(this.historiqueActivitePartielle).sort((d1, d2) => {
            return (d2 > d1 ? -1 : 1)
          }).map((p) => {
            return [
              new Date(p),
              this.historiqueActivitePartielle[p],
            ]
          }),
          type: 'area',
        }, {
          name: 'effectifs',
          data: Object.keys(this.historiqueEffectif).sort((d1, d2) => {
            return (d2 > d1 ? -1 : 1)
          }).map((p) => {
            return [
              new Date(p),
              this.historiqueEffectif[p],
            ]
          }),
        }]
      } else {
        return []
      }
    },
    effectifOptions() {
      return {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: false,
          showForZeroSeries: false,
        },
        tooltip: {
          enabled: true,
          x: {
            formatter(val) {
              return new Date(val).toLocaleDateString()
            },
          },
          y: {
            formatter(val, { series, seriesIndex, dataPointIndex, w }) {
              let y = parseFloat(val.toFixed(1)).toLocaleString()
              const etpIndex = 1
              y += (seriesIndex === etpIndex) ? ' ETP' : ' salariés'
              return y
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
          id: 'effectifs',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          min: 0,
          labels: {
            formatter(val, index) {
              return val.toFixed(0)
            },
          },
        },
        colors: ['#e76278', '#4f8a83'],
        fill: {
          type: ['solid', 'solid'],
          colors: ['#e76278', '#4f8a83'],
        },
        stroke: {
          curve: ['stepline', 'smooth'],
          width: [0, 5],
        },
        noData: {
          text: 'Il n\'y a pas de données associées',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
        },
        annotations: {
          position: 'front',
          xaxis: [{
            x: new Date('17 Mar 2020').getTime(),
            x2: new Date('11 May 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°1',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }, {
            x: new Date('30 Oct 2020').getTime(),
            x2: new Date('15 Dec 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°2',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }],
        },
      }
    },
    urssafSeries() {
      if (Object.keys(this.historiqueDetteSociale).length > 0) {
        return [{
          name: 'cotisations appelées',
          type: 'line',
          data: Object.keys(this.historiqueDetteSociale).sort((d1, d2) => {
            return (d2 > d1 ? -1 : 1)
          }).reduce((data, p) => {
            if (this.historiqueDetteSociale[p].cotisation !== null) {
              data.push([
                new Date(p),
                Math.round(this.historiqueDetteSociale[p].cotisation),
              ])
            }
            return data
          }, []),
        }, {
          name: 'dette restante (part patronale)',
          type: 'area',
          data: Object.keys(this.historiqueDetteSociale).sort((d1, d2) => {
            return (d2 > d1 ? -1 : 1)
          }).map((p) => {
            return [
              new Date(p),
              this.historiqueDetteSociale[p].partPatronale,
            ]
          }),
        }, {
          name: 'dette restante (part salariale)',
          type: 'area',
          data: Object.keys(this.historiqueDetteSociale).sort((d1, d2) => {
            return (d2 > d1 ? -1 : 1)
          }).map((p) => {
            return [
              new Date(p),
              this.historiqueDetteSociale[p].partSalariale,
            ]
          }),
        }]
      } else {
        return []
      }
    },
    urssafOptions() {
      return {
        tooltip: {
          enabled: true,
          x: {
            format: 'MM/yyyy',
          },
          y: {
            formatter(val) {
              return parseFloat(val).toLocaleString() + ' €'
            },
          },
        },
        legend: {
          show: true,
          showForSingleSeries: true,
          onItemHover: {
            highlightDataSeries: false,
          },
        },
        theme: {
          mode: 'light',
          palette: 'palette6',
        },
        stroke: {
          curve: 'smooth',
          width: [5, 0, 0],
        },
        colors: ['#4f8a83', '#fac699', '#e76278'],
        fill: {
          type: ['solid', 'solid', 'solid'],
          colors: ['#4f8a83', '#fac699', '#e76278'],
          gradient: {
            type: 'vertical',
            shadeIntensity: 0,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.8,
            opacityTo: 0.8,
            stops: [0, 80, 100],
            colorStops: [],
          },
        },
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'urssaf',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          title: {
            text: '€ (euros)',
          },
          labels: {
            formatter(val, index) {
              return val.toFixed(0)
            },
          },
        },
        states: {
          hover: {
            filter: {
              type: 'none',
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
        annotations: {
          position: 'front',
          xaxis: [{
            x: new Date('17 Mar 2020').getTime(),
            x2: new Date('11 May 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°1',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }, {
            x: new Date('30 Oct 2020').getTime(),
            x2: new Date('15 Dec 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°2',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }],
        },
      }
    },
    minDate() {
      const today = new Date()
      const min = new Date(today.getFullYear() - 2, today.getMonth(), 1)
      return min
    },
    introEffectif() {
      let introEffectif = ''
      if (this.ecartEffectif === 0) {
        return 'est resté constant (' + this.pluralizeEffectif(this.minEffectif.valeur) + ')'
      } else if (this.minDateEffectif === this.minEffectif.periode
        && this.maxDateEffectif === this.maxEffectif.periode) {
        introEffectif = 'a augmenté (+'
      } else if (this.minDateEffectif === this.maxEffectif.periode
        && this.maxDateEffectif === this.minEffectif.periode) {
        introEffectif = 'a baissé (-'
      } else {
        introEffectif = 'a fluctué (±'
      }
      introEffectif += this.pluralizeEffectif(this.ecartEffectif) + ')'
      return introEffectif
    },
    totalPages() {
      return Math.ceil(this.autresEtablissements.length / this.itemsPerPage)
    },
    paginate() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
      const index = this.currentPage * this.itemsPerPage - this.itemsPerPage
      return this.autresEtablissements.slice(index, index + this.itemsPerPage)
    },
    permUrssaf() {
      return (this.siegeEntreprise || {}).permUrssaf || false
    },
    permDGEFP() {
      return (this.siegeEntreprise || {}).permDGEFP || false
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
</script>
<style scoped>
.resume {
  font-family: "Abel";
  font-size: 16px;
}
.valeur {
  font-size: 25px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>