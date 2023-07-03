import '@fortawesome/fontawesome-free/css/all.css' // Ensure your project is capable of handling css files
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
})
