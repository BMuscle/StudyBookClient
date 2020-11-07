<template>
  <div class="tags">
    <div v-for="(tag, index) in tags" :key="tag.id">
      <Tag :name="tag.name" @tag-change="editTag({tag:$event, index:index})" @pass-delete-tag="deleteTag({tag:$event, index:index})"/>
    </div>
    <div>
      <button v-show="!isEditing" @click="initCreatingTag">タグ追加ボタン（仮）</button>
      <div v-show="isEditing">
        <input type="text" ref="createInput" v-model="new_tag" @keydown.enter="createTag(new_tag),endCreatingTag()" @blur="endCreatingTag">
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
      'createTag',
      'editTag',
      'deleteTag'
    ]),
    async initCreatingTag() {
      await(this.isEditing = true)
      this.$refs.createInput.focus()
    },
    endCreatingTag() {
      this.isEditing = false
      this.new_tag = ''
    }
  },
  data: function(){
    return{
      new_tag: '',
      isEditing: false
    }
  }
}
</script>

<style>

</style>
