<template>
  <a :href="href">{{fullname}}</a>
</template>

<script>
export default {
  name: 'MailtoUser',
  props: ['fullname', 'email', 'subject'],
  computed: {
    href() {
      return `mailto:${this.email}?subject=${this.subject}`
    }
  }
}
</script>