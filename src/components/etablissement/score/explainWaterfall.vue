<template>
  <div>

    <p class="mt-3" style="margin-bottom: 0 !important;">
      Le graphique ci-dessous détaille les éléments constitutifs du calcul de la probabilité de défaillance de l'entreprise. Chaque groupe de variables analysé induit soit un facteur aggravant (en rouge) soit un facteur atténuant le risque (en vert). Le pourcentage de risque de défaillance de l'entreprise (en bleu) résulte de la somme des points de pourcentage de ces groupes de variables. 
      Le risque estimé peut se situer dans trois zones :<br /><br />
      <ul>
        <li>La zone rouge : l'entreprise présente un risque de défaillance élevé.</li>
        <li>La zone jaune : l'entreprise présente un risque de défaillance modéré.</li>
        <li>La zone verte : si le score ne dépasse pas un certain seuil de risque, l'entreprise n'est pas détectée. </li>
      </ul>  
    </p>
    <v-alert
      v-if="showBanner"
      type="info"
      variant="tonal"
      class="mb-6 mt-6"
      color="info"
      density="comfortable"
    >
      Si la détection mentionne des dettes sociales, vérifiez leur présence dans les établissements fermés, car la détection peut s'expliquer par un transfert éventuel de la dette suite à la fermeture du siège.
    </v-alert>
    <div class="mb-3" ref="graph"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js';

export default {
  name: "EtablissementScoreExplainWaterfall",
  props: ['liste', 'score', 'macroExpl', 'summary'],
  methods: {
    percent(value) {
      return Math.round(value) + "%";
    },
    titleize(slug) {
      // Use this function to format the variable (slugs) names if needed
      // if (slug === 'misc') return 'Variation de l\'effectif de l\'entreprise';
      var words = slug.split("_");
      return words.map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
    },
    renderChart() {
      Plotly.newPlot(this.$refs.graph, this.data, this.layout, { displayModeBar: false, scrollZoom: false, responsive: true });
    }
  },
  computed: {
    showBanner() {
      return this.summary?.alert?.includes('Alerte seuil F1') || this.summary?.alert?.includes('Alerte seuil F2')
    },
    macroExplEntries() {
      let values = Object.entries(this.macroExpl);
      values.sort((v1, v2) => (Math.abs(v1[1]) > Math.abs(v2[1]) ? -1 : 1));
      return values;
    },
    macroExplArrays() {
      let values = this.macroExplEntries;

      const positiveValues = values.filter(v => v[1] >= 0).sort((a, b) => b[1] - a[1]);
      const negativeValues = values.filter(v => v[1] < 0).sort((a, b) => b[1] - a[1]);

      const sortedValues = positiveValues.concat(negativeValues);

      return {
        x: sortedValues.map(v => this.titleize(v[0])).concat(['Risque de défaillance (%)']),
        y: sortedValues.map(v => v[1] / 100).concat([this.percent(this.score)]),
        measure: sortedValues.map(v => 'relative').concat(['total']),
        text: sortedValues.map(v => ((v[1] > 0) ? '+' : '') + this.percent(v[1])).concat([this.percent(this.score)])      };
    },
    data() {
      // Calculate cumulative y values to determine the threshold and set text position in bars
      const macroExplArrays = this.macroExplArrays;
  
      let cumulative = 0;
      const yWithCumulative = macroExplArrays.y.slice(0, -1).map((y) => {
        cumulative += y;
        return cumulative;
      });
      const maxY = Math.max(...yWithCumulative);
      const threshold = maxY * 0.9;

      // Return the waterfall chart data for plotly
      return [{
        name: "weight",
        type: "waterfall",
        orientation: "v",
        measure: this.macroExplArrays.measure,
        x: this.macroExplArrays.x,
        textposition: yWithCumulative.map(cumulativeValue => cumulativeValue > threshold ? "inside" : "outside"),
        text: this.macroExplArrays.text,
        y: this.macroExplArrays.y,
        hoverinfo: 'y',
        increasing: {
          marker: { color: "#D32F2F" }
        },
        decreasing: {
          marker: { color: "#4CAF50" }
        },
        connector: {
          mode: "between",
          line: {
            width: 2,
            color: "#BBB",
            dash: 0
          }
        }
      }];
    },
    layout() {
      return {
        dragmode: false,
        hovercursor: 'pointer',
        title: {
          text: 'Eléments constitutifs de cette alerte',
          font: {
            family: 'Oswald, sans-serif',
            size: 24
          },
          xref: 'paper',
          x: 0.5,

        },
        shapes: [
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
            line: { width: 0 }
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
            line: { width: 0 }
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
            line: { width: 0 }
          },
        ],
        xaxis: {
          type: "category",
          fixedrange: true,
          automargin: true,
        },
        yaxis: {
          type: "linear",
          tickformat: '.0%',
        },
        hovermode: 'closest',
        autosize: true,
      };
    }
  },
  mounted() {
    this.renderChart(); 
  }
}
</script>