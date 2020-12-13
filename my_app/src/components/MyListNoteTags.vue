<template>
  <div class="note-tags">
    <div v-if="tags.length > 0" class="note-tags">
      <div  v-for="tag in tags" :key="tag" class= "tag">
        <TagIcon
          :name="tag.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TagIcon from './icons/TagIcon.vue'
import MyListNote from '@/models/MyListNote'

export default {
  components: {
    TagIcon
  },
  props: {
    tags: Object
  },
}
</script>

<style scoped lang="scss">
.note-tags {
  display: inline-block;
  .tag {
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
