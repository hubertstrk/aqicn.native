<template>
  <StackLayout rows="*, *" columns="*">
    <Label verticalAlignment="center" horizontalAlignment="center" row="0" col="0" textWrap="true" class="h1" :text="text" />
    <Label verticalAlignment="center" horizontalAlignment="center" row="1" col="0" textWrap="true" class="h3 font-italic" :text="description" />
  </StackLayout>
</template>

<script>

export default {
  props: {
    text: String,
    description: String
  }
}
</script>

<style>
</style>
