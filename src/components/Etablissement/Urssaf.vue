<template>
  <div>
    <v-toolbar dark color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">
          Débits Urssaf
      </v-toolbar-title>
      <v-spacer/>
      <v-menu max-width="400px" offset-y>                 
        <v-btn slot="activator" icon><v-icon>help</v-icon></v-btn>
        <v-card>
          <v-card-title class="headline">
            Cotisations et Débits URSSAF
          </v-card-title>
          <v-card-text>
            Ce graphique représente les données URSSAF:<br/>
            <ul>
              <li> Cotisations: Montant des cotisations appelées. La date désigne la fin de la période appelée.</li>
              <li> Débits: Cumul des dettes restantes à payer. La date désigne la fin de la période de constatation du débit</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn flat color="success">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <IEcharts
      auto-resize
      :resizable="true"
      v-if="roles.includes('urssaf')"
      :loading="chart"
      style="width: 100%; height: 350px"
      :option="urssafOptions"
    />
    <div 
      style=" height: 350px; width: 100%; text-align: center;"
      v-if="!roles.includes('urssaf')"
    >
      <img
      style="vertical-align: middle; margin: 125px 0; opacity: 0.2;"
      height="100px"
      src="@/assets/noaccess.svg"/>
    </div>
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'Urssaf',
  components: { IEcharts },
  props: ['debit', 'cotisation', 'chart', 'roles'],
  computed: {
    urssafOptions() {
      return {
        title: {
          text: null,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56',
            },
          },
        },
        legend: {
          data: ['Cotisation', 'Débit'],
          y: 'bottom',
        },
        toolbox: {
          show: true,
        },
        xAxis: {
          show: true,
          type: 'category',
          axisTick: false,
          data: this.debit.map((d) => (d.periode || '').slice(0, 10)),
        },
        yAxis: {
          type: 'value',
          show: true,
        },
        series: [{
          color: 'indigo',
          smooth: true,
          name: 'Cotisation',
          type: 'line',
          data: this.cotisation,
        }, {
          color: 'red',
          smooth: true,
          name: 'Débit',
          type: 'line',
          data: this.debit.map((d) => d.part_ouvriere + d.part_patronale),
        }],
      }
    },
  },
  
}
</script>