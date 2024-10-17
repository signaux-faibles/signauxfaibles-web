<template>
    <div>
      <p>Déconnexion en cours...</p>
    </div>
</template>
  
<script>
  export default {
    created() {
      this.logout()
    },
    methods: {
        logout() {
            if (this.$route.path !== '/') {
                this.$router.push('/')
            } 
            this.$keycloak.logoutFn()
        },
    }
  }
</script>