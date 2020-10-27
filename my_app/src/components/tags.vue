<template>
  <div class="tags">
    <div v-for="tag in tags" :key="tag.id">
      <Tag v-bind:name="tag.name" v-on:input="tag.name = $event" />
    </div>
  </div>
</template>

<script>
import Tag from "@/components/tag.vue";
export default {
  components: {
    Tag
  },
  methods:{
  },
  data: function () {
    return {
      tags: [
        { id: 1, name: "タグネーム" },
        { id: 2, name: "タグネーム" },
        { id: 3, name: "タグネーム" },
      ],
    };
  }
}
</script>

<style>

</style>
