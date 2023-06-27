export default {
    name: "Card",
    props: ['card'],
    mounted() {
        this.show = true
    },
    data() {return {
        show: false
    }}
}
