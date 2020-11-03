<template>
  <div>
    <div v-if="flag">
      <input v-model="tag" @keydown="flag = false" @blur="flag = false" state="tag"> 
    </div>
    <div class="tag" v-else @click="editflag()">
     {{name}}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('md_header',{
      tags: state => state.tags 
    })
  },
  props:{
    name: String
  },
  methods: {
    changeTag: function() {
      this.$emit('input', "変更後タグ名")
    },
    ...mapActions('md_header',[
      'update',
      'createTag'
    ]),
    editflag: function() {
      this.flag = true
      this.$nextTick(function() {
        this.state.tag.focus() 
      })
    },
  },
  data: function(){
    return{
      flag: false, 
    }  
  },
}
</script>

<style>
</style>
