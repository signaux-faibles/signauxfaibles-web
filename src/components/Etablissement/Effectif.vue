<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">Effectifs</v-toolbar-title>
    </v-toolbar>
    <IEcharts
      :resizable="true"
      auto-resize
      :loading="chart"
      style="width: 100%; height: 350px"
      :option="effectifOptions"
    />
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/full.js'

import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'Effectif',
  props: ['effectif', 'chart'],
  components: { IEcharts },
  computed: {
    effectifOptions() {

      return {
        title: {
          text: null,
        },
        legend: {
          data: ['effectif'],
          y: 'bottom',
        },
        toolbox: {
          show: true,
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
        xAxis: {
          show: true,
          splitLine: {
            show: false
          },
          axisLabel: {
            rotate: 45,
            formatter(value) {
              return value.getFullYear() + 't' + Math.round(value.getUTCMonth()/3)
            }
          },
          // min: new Date(this.effectif[0].periode),
          // max: new Date(this.effectif[22].periode),
          
          type: 'category',
          // data: this.effectif.map((e) => {return new Date(e.periode)}),
        },
        yAxis: {
          type: 'value',
          show: true,
        },
        series: [{
          name: 'effectif',
          color: 'indigo',
          step: 'end',
          type: 'line',
          data: this.effectif.map((e) => {
            let periode = new Date(e.periode)
            return [
              periode,
              e.effectif
            ]
          }),
        }],
      }
    }
  },
}
</script>