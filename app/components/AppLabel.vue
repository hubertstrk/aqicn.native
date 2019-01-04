<template>
  <Label :text="text" class="label" :class="{small: small, medium: medium, large: large}"/>
</template>

<script>
export default {
  props: {
    text: '',
    small: Boolean,
    medium: Boolean,
    large: Boolean
  }
}
</script>

<style lang="css" scoped>
.label {
  color: white;
  font-family: 'Montserrat-Light';
}
.small {font-size: 12px;}
.medium {font-size: 18px;}
.large {font-size: 24px;}
</style>
