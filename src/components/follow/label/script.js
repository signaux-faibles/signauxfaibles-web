import labelColors from "@/assets/labels.json";

export default {
  name: "FollowLabel",
  props: ['label', 'small'],
  computed: {
    color() {
      return labelColors[this.label.color]
    }
  }
}