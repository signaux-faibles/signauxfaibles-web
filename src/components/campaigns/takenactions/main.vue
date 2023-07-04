<template>
  <div>
    <div v-for="action in allActions" :key="action.id">
      {{ action }}
    </div>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>