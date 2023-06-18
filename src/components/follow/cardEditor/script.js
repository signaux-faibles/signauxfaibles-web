export default {
  name: "FollowCardEditor",
  props: ['card'],
  data() {
    return {
      content: "coucou"
    }
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    editCardID() {
      return this.$store.state.editCardID
    }
  },
  methods: {
    nullFunction(evt) {
      return evt
    },
    hideEditor(evt) {
      this.edit = false
      return evt
    },
    showEditor(evt) {
      this.edit = true
      return evt
    },
  }
}