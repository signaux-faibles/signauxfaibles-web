<template>
  <div>
    <p class="mt-3" style="margin-bottom: 0 !important;">
      Le graphique ci-dessous détaille les éléments constitutifs du calcul de la probabilité de défaillance de l’entreprise. Chaque groupe de variables analysé induit soit un facteur aggravant (en rouge) soit un facteur atténuant le risque (en vert). Le pourcentage de risque de défaillance de l’entreprise (en bleu) résulte de la somme des points de pourcentage de ces groupes de variables. 
      Le risque estimé peut se situer dans trois zones :<br /><br />
      <ul>
        <li>La zone rouge : l’entreprise présente un risque de défaillance élevé.</li>
        <li>La zone jaune : l’entreprise présente un risque de défaillance modéré.</li>
        <li>La zone verte : si le score ne dépasse pas un certain seuil de risque, l’entreprise n’est pas détectée. </li>
      </ul>  
    </p>
    <div class="mb-3" ref="graph"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js';

export default {
  name: "EtablissementScoreExplainWaterfall",
  props: ['liste', 'score', 'macroExpl'],
  methods: {
    percent(value) {
      return ((100 * value).toFixed(0) + "%");
    },
    titleize(slug) {
      if (slug === 'misc') return 'Variation de l\'effectif de l\'entreprise';
      if (slug === 'santé_financière') return 'Données financières';
      if (slug === 'dette_urssaf') return 'Dettes sociales';
      if (slug === 'activité_partielle') return 'Recours à l\'activité partielle';
      if (slug === 'retards_paiement') return 'Retards de paiement fournisseurs';

      var words = slug.split("_");
      return words.map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
    },
    renderChart() {
      Plotly.newPlot(this.$refs.graph, this.data, this.layout, { displayModeBar: false });
    }
  },
  computed: {
    macroExplEntries() {
      let values = Object.entries(this.macroExpl);
      values.sort((v1, v2) => (Math.abs(v1[1]) > Math.abs(v2[1]) ? -1 : 1));
      return values;
    },
    macroExplArrays() {
      let values = this.macroExplEntries;

      values = values.map(entry => [entry[0], entry[1] - parseFloat(process.env.VUE_APP_EXPECTED_VALUE)]);

      const sumOfEntries = values.reduce((sum, entry) => sum + entry[1], 0);
      const macroEff = this.score - (parseFloat(process.env.VUE_APP_EXPECTED_VALUE) + sumOfEntries);

      const r = this.score / (this.score - parseFloat(process.env.VUE_APP_EXPECTED_VALUE));

      const positiveValues = values.filter(v => v[1] > 0).sort((a, b) => b[1] - a[1]);
      const negativeValues = values.filter(v => v[1] < 0).sort((a, b) => b[1] - a[1]);

      const sortedValues = positiveValues.concat(negativeValues);

      return {
        x: sortedValues.map(v => this.titleize(v[0])).concat(['Variation de l\'effectif de l\'entreprise','Risque de défaillance (%)']),
        y: sortedValues.map(v => r * v[1]).concat([r * macroEff, this.score]),
        measure: sortedValues.map(v => 'relative').concat(['relative', 'total']),
        text: sortedValues.map(v => ((v[1] > 0) ? '+' : '') + this.percent(r * v[1])).concat([((macroEff > 0) ? '+' : '') + this.percent(r * macroEff), this.percent(this.score)])
      };
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
            x0: Object.keys(this.macroExpl).length + 0.5,
            x1: Object.keys(this.macroExpl).length + 1.5,
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
            x0: Object.keys(this.macroExpl).length + 0.5,
            x1: Object.keys(this.macroExpl).length + 1.5,
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
            x0: Object.keys(this.macroExpl).length + 0.5,
            x1: Object.keys(this.macroExpl).length + 1.5,
            y0: 0,
            y1: process.env.VUE_APP_SEUIL_F2,
            layer: 'below',
            fillcolor: '#4CAF50',
            opacity: 0.2,
            line: { width: 0 }
          },
          // {
          //   type: 'rect',
          //   xref: 'paper',
          //   yref: 'paper',
          //   x0: 0.0,
          //   x1: 0.02,
          //   y0: -0.52,
          //   y1: -0.5,
          //   fillcolor: "#4CAF50",
          //   line: { width: 0 }
          // },
          // {
          //   type: 'rect',
          //   xref: 'paper',
          //   yref: 'paper',
          //   x0: 0.0,
          //   x1: 0.02,
          //   y0: -0.62,
          //   y1: -0.6,
          //   fillcolor: "#D32F2F",
          //   line: { width: 0 }
          // },
          // {
          //   type: 'rect',
          //   xref: 'paper',
          //   yref: 'paper',
          //   x0: 0.0,
          //   x1: 0.02,
          //   y0: -0.72,
          //   y1: -0.7,
          //   fillcolor: "#4499FF",
          //   line: { width: 0 }
          // }
        ],
        // annotations: [
        //     {
        //     xref: 'paper',
        //     yref: 'paper',
        //     x: 0.03,
        //     y: -0.50,
        //     xanchor: 'left',
        //     yanchor: 'middle',
        //     text: 'Points de pourcentage diminuant le risque d’entrer en défaillance sous 18 mois',
        //     showarrow: false,
        //     font: { size: 12 }
        //   },
        //   {
        //     xref: 'paper',
        //     yref: 'paper',
        //     x: 0.03,
        //     y: -0.60,
        //     xanchor: 'left',
        //     yanchor: 'middle',
        //     text: 'Points de pourcentage aggravant le risque d’entrer en défaillance sous 18 mois',
        //     showarrow: false,
        //     font: { size: 12 }
        //   },
        //   {
        //     xref: 'paper',
        //     yref: 'paper',
        //     x: 0.03,
        //     y: -0.70,
        //     xanchor: 'left',
        //     yanchor: 'middle',
        //     text: 'Total',
        //     showarrow: false,
        //     font: { size: 12 }
        //   }
        // ],
        xaxis: {
          type: "category",
          fixedrange: true,
          automargin: true,
        },
        yaxis: {
          type: "linear",
          tickformat: ',.0%',
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