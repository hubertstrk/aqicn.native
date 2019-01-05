<template>
  <Label textWrap="true" :text="text" class="label" :class="{small: small, medium: medium, large: large, xLarge: xLarge, xSmall: xSmall}"/>
</template>

<script>
export default {
  props: {
    text: '',
    small: Boolean,
    medium: Boolean,
    large: Boolean,
    xLarge: Boolean,
    xSmall: Boolean,
  }
}
</script>

<style lang="css" scoped>
.label {
  padding: 1px 5px;
}
.xSmall {font-size: 10px;}
.small {font-size: 12px;}
.medium {font-size: 18px;}
.large {font-size: 24px;}
.xLarge {font-size: 30px;}
</style>
