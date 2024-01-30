<template>
    <Plotly
        @click="plotlyClick"
        :data="data"
        :layout="layout"
        :display-mode-bar="false"
    />
</template>

<script>
import { Plotly } from 'vue-plotly'

export default {
  name: "EtablissementScoreExplainWaterfall",
  components: {Plotly},
  props: ['liste', 'score', 'microExpl', 'macroExpl'],
  mounted() {
    console.log(this.$refs.graph)
  },
  methods: {
    percent(value) {
      return  ((100*value).toFixed(0) + "%")
    },
    plotlyClick(event) {
      console.log(event)
    },
    titleize(slug) {
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
      const values = this.macroExplEntries
      return {
        x: values.map((v) => this.titleize(v[0])).concat(["probabilité défaillance"]),
        y: values.map((v) => v[1]).concat([this.score]),
        measure: values.map((v) => {
          return 'relative'
        }).concat(['total']),
        text: values.map((v) => ((v[1]>0)?'+':'') + this.percent(v[1])).concat([this.percent(this.score)])
      }
    },
    data() {
      return [{
        name: "weight",
        type: "waterfall",
        orientation: "v",
        width: 0.66,
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
          marker:{
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
        shapes: [
          // 2nd highlight during Feb 20 - Feb 23
          {
            type: 'rect',
            xref: 'x',
            x0: Object.keys(this.macroExpl).length - 0.5,
            x1: Object.keys(this.macroExpl).length + 0.5,
            y0: this.liste.metadata.f1Score,
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
            y0: this.liste.metadata.f2Score,
            y1: this.liste.metadata.f1Score,
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
            y1: this.liste.metadata.f2Score,
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