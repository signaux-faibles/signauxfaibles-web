import Help from "@/components/Help.vue";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt()

export default {
    name: 'Boards',
    props: ['card', 'denomination'],
    components: {Help},
    methods: {
        unarchiveCard(cardId) {
            this.$axios(`/kanban/unarchive/${this.card.id}`).then(() => {
                this.$bus.$emit('unarchive-card')
            })
        },
    },
    computed: {
        startDate() {
            return new Date(this.card.startAt).toLocaleDateString()
        },
        endDate() {
            return new Date(this.card.endAt).toLocaleDateString()
        },
        lastActivityDate() {
            return new Date(this.card.lastActivity).toLocaleDateString()
        },
        description() {
            return md.render(this.card.description || "")
        }
    }
}