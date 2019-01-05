<template>
  <StackLayout row="2" col="0">
    <AppLabel row="0" col="0" :text="text" large></AppLabel>
    <AppLabel row="1" col="0" :text="description" small></AppLabel>
  </StackLayout>
</template>

<script>
import AppLabel from './AppLabel'

export default {
  props: {
    text: '',
    description: ''
  },
  components: {
    AppLabel
  }
}
</script>

<style>
</style>
