<template>
  <div>
    <p class="mt-3" style="margin-bottom: 0 !important;">
      Le graphique ci-dessous détaille les éléments constitutifs du calcul de la probabilité de défaillance de l’entreprise. 
      Chaque groupe de variables analysé induit soit un facteur aggravant (en rouge) soit un facteur atténuant le risque (en vert). La probabilité de défaillance est la somme des contributions de ces groupes. Ainsi le risque estimé peut se situer dans trois zones :<br /><br />
      <ul>
        <li>La zone rouge : l’entreprise présente un risque de défaillance élevé.</li>
        <li>La zone jaune : l’entreprise présente un risque de défaillance modéré.</li>
        <li>La zone verte : si le score ne dépasse pas un certain seuil de risque, l’entreprise n’est pas détectée. </li>
      </ul>  
    </p>
      <Plotly
          @hover="plotlyHover"
          @unhover="plotlyUnhover"
          ref="graph"
          :data="data"
          :layout="layout"
          :display-mode-bar="false"
      />
  </div>
</template>

<script>
import { Plotly } from 'vue-plotly'

export default {
  name: "EtablissementScoreExplainWaterfall",
  components: {Plotly},
  props: ['liste', 'score', 'macroExpl'],
  methods: {
    percent(value) {
      return  ((100*value).toFixed(0) + "%")
    },
    plotlyHover(event) {
      event.event.target.style.cursor = 'pointer'
    },
    plotlyUnhover(event) {
      event.event.target.style.cursor = 'default'
    },
    titleize(slug) {
      if (slug === 'misc') return 'Variation de l’effectif';
      var words = slug.split("_");
      return words.map(function(word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      }).join(' ');
    },
  },
  computed: {
    macroExplBoundaries() {
      const entries = this.macroExplEntries
      const boundaries = entries.map((entry) => entry[1]).reduce((m, value) => {
        m.current += value
        m.max = Math.max(m.current, m.max)
        m.min = Math.min(m.current, m.min)
        return m
      }, {current:0, max: 1, min: 0})
      return [boundaries.min, boundaries.max]
    },
    macroExplEntries() {
      let values = Object.entries(this.macroExpl)
      values.sort((v1, v2) => {
        return (Math.abs(v1[1]) > Math.abs(v2[1]))?-1:1
      })
      return values
    },
    macroExplArrays() {
      const values = this.macroExplEntries;
      const esperanceEntry = values.find(v => v[0] === 'esperance');
      const filteredValues = values.filter(v => v[0] !== 'esperance');

      return {
        x: ['Espérance'].concat(filteredValues.map((v) => this.titleize(v[0]))).concat(["probabilité défaillance"]),
        y: [esperanceEntry ? esperanceEntry[1] : 0].concat(filteredValues.map((v) => v[1])).concat([this.score]),
        measure: ['absolute'].concat(filteredValues.map((v) => 'relative')).concat(['total']),
        text: [esperanceEntry ? this.percent(esperanceEntry[1]) : '0%'].concat(filteredValues.map((v) => ((v[1] > 0) ? '+' : '') + this.percent(v[1]))).concat([this.percent(this.score)])
      };
    },
    data() {
      return [{
        name: "weight",
        type: "waterfall",
        orientation: "v",
        measure: this.macroExplArrays.measure,
        x: this.macroExplArrays.x,
        textposition: "outside",
        text: this.macroExplArrays.text,
        y: this.macroExplArrays.y,
        hoverinfo: 'none',
        increasing: {
          marker: {
            color: "#D32F2F"
          }
        },
        decreasing: {
          marker: {
            color: "#4CAF50"
          }
        },
        connector: {
          mode: "between",
          line: {
            width: 2,
            color: "#BBB",
            dash: 0
          }
        }
      }]
    },
    layout() {
      return {
        title: {
          text:'Eléments constitutifs de cette alerte',
          font: {
            family: 'Oswald, sans-serif',
            size: 24
          },
          xref: 'paper',
          x: 0.5,
        },
        shapes: [
          // 2nd highlight during Feb 20 - Feb 23
          {
            type: 'rect',
            xref: 'x',
            x0: Object.keys(this.macroExpl).length - 0.5,
            x1: Object.keys(this.macroExpl).length + 0.5,
            y0: process.env.VUE_APP_SEUIL_F1,
            y1: 1,
            layer: 'below',
            fillcolor: '#D32F2F',
            opacity: 0.2,
            line: {
              width: 0
            }
          },
          {
            type: 'rect',
            xref: 'x',
            x0: Object.keys(this.macroExpl).length - 0.5,
            x1: Object.keys(this.macroExpl).length + 0.5,
            y0: process.env.VUE_APP_SEUIL_F2,
            y1: process.env.VUE_APP_SEUIL_F1,
            layer: 'below',
            fillcolor: '#FFA000',
            opacity: 0.2,
            line: {
              width: 0
            }
          },
          {
            type: 'rect',
            xref: 'x',
            x0: Object.keys(this.macroExpl).length - 0.5,
            x1: Object.keys(this.macroExpl).length + 0.5,
            y0: 0,
            y1: process.env.VUE_APP_SEUIL_F2,
            layer: 'below',
            fillcolor: '#4CAF50',
            opacity: 0.2,
            line: {
              width: 0
            }
          }
        ],
        xaxis: {
          type: "category",
          fixedrange: true,
          automargin: true,
        },
        yaxis: {
          type: "linear",
          range: this.macroExplBoundaries,
          tickformat: ',.0%',
          fixedrange: true,          
        },
        hovermode:  'closest',
        showlegend: false,
        autosize: true,
      }
    },

  }
}
</script>