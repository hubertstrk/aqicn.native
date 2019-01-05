<template>
  <Label textWrap="true" :text="text" class="label" :class="{small: small, medium: medium, large: large}"/>
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
  padding: 1px 5px;
}
.small {font-size: 12px;}
.medium {font-size: 18px;}
.large {font-size: 24px;}
</style>
