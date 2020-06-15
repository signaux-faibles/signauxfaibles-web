<template>
  <!-- <div>
    <v-btn @click="test"/> -->
  <div id='map' style="position: relative; width: 100%; height: 100%; border: 1px solid black">

  </div>
  <!-- </div> -->
</template>

<script>
  export default {
    props: ['latitude', 'longitude'],
    data() {
      return {
        accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
        mapStyle: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
        map: null,
        marker: new mapboxgl.Marker(),
      }
    },
    mounted() {
      mapboxgl.accessToken = this.accessToken
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.mapStyle,
        center: this.coordinates,
        zoom: 8,
      })
      this.map.resize()
    },
    watch: {
      coordinates(val) {
        this.marker.setLngLat(this.coordinates)
        this.marker.addTo(this.map)
        this.map.resize()
        this.map.flyTo({center: this.coordinates})
      },
    },
    computed: {
      ready() {return (this.longitude || '') !== ''},
      coordinates() {
        return [parseFloat(this.longitude) || 0, parseFloat(this.latitude) || 0]
      },
    },
  }
</script>
