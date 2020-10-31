<template>
  <div class="tags">
    <div v-for="tag in tags" :key="tag">
      <Tag v-bind:name="tag" v-on:input="tag = $event" />
    </div>
    <div>
      <div class="button" v-if="flag" @click="flag = false">タグ追加ボタン（仮）</div>
      <div v-else>
        <input type="text"  v-model="new_tag" @keydown.enter="createTag(new_tag),flagReset()" >
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/tag.vue";
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    Tag
  },
  computed: {
    ...mapState('md_header',{
      tags: state => state.tags 
    })
  },
  methods: {
    ...mapActions('md_header',[
      'update',
      'createTag'
    ]),
    flagReset: function(){
      this.flag = true
      this.new_tag = ''
    },
  },
  created: function(){
    this.update('tags: タグ名')
  },
  data: function(){
    return{
      new_tag: '',
      flag: true
    }
  }
}
</script>

<style>

</style>
