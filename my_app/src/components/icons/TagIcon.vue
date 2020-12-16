<template>
  <div class="tag-icon">
    {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
}
</script>

<style scoped lang="scss">
.tag-icon {
  padding: 1px 5px;
  background-color: #ddd;
  border-radius: 20px;
}
</style>
