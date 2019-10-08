<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">Effectifs</v-toolbar-title>
    </v-toolbar>
    <IEcharts
      auto-resize
      :loading="chart"
      style="width: 100%; height: 350px"
      :option="effectifOptions"
    />
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'

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
          type: 'category',
          data: this.effectif.map((e) => e.periode.slice(0, 10)),
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
          data: this.effectif.map((e) => e.effectif),
        }],
      }
    },
  }
}
</script>