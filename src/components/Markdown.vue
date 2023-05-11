<template>
    <div v-html="markdown">
    </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
export default {
    props: ['text'],
    name: "Markdown",
    computed: {
        markdown() {
            const md = new MarkdownIt()
            return md.render(this.text)
        }
    }
}
</script>