<template>
  <div>
    {{ macroExpl }}
    <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
  </div>
</template>

<script>
import { Plotly } from 'vue-plotly'

export default {
  name: "EtablissementScoreExplainWaterfall",
  components: {Plotly},
  props: ['microExpl', 'macroExpl'],
  computed: {
    data() {
      return [{
        name: "Poids",
        type: "waterfall",
        orientation: "v",
        width: 0.66,
        measure: [
          "relative",
          "relative",
          "relative",
          "relative",
          "total",
        ],
        x: [
          "Informations financières",
          "Dette sociale",
          "Activité partielle",
          "Retards de paiement",
          "Risque de défaillance",
        ],
        textposition: "outside",
        text: [
          "+73%",
          "-24%",
          "+13%",
          "-8%",
          "54%"
        ],
        y: [
          0.73,
          -0.24,
          0.13,
          -0.08,
          0.54
        ],
        increasing: {
          marker: {
            color:"#D32F2F"
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
            color: "rgb(0, 0, 0)",
            dash: 0
          }
        }
      }]
    },
    layout() {
      return {
        xaxis: {
          type: "category",
          // autorange: "reversed"
        },
        yaxis: {
          type: "linear",
          range: [0, 1],
          tickformat: ',.0%',
          // showticklabels: false,
        },
        // margin: {l: 150},
        showlegend: false,
        autosize: true,
      }
    },

  }
}
</script>