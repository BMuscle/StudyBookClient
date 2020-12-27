<template>
  <div>
    <div class="flash" v-if="flash.length > 0" @animationend="removeFlash($event, f)">
      <div class="flash-message">
        <div v-for="(f, index) in flash" :key="index">
          <div class="alert" :class="`alert-${f.key}`">
            {{f.message}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('flash', ['flash'])
  },
  methods: {
    ...mapMutations('flash', ['clearFlash']),
    removeFlash(e, f) {
      if(e.animationName == 'fadeOut') {
        this.clearFlash()
      }
    }
  }
}
</script>
<style lang="sass" scoped>

.flash
  animation: fadeIn 0.5s, fadeOut 1s 3s forwards
  font-size: 0.8em
  bottom: 10px
  left: 30px
  max-width: 80%
  position: fixed
  z-index: 20000
</style>
