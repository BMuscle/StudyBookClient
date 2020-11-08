<template>
  <div class="home">
    <HelloWorld text_data="親から子へのデータ渡し" />
  </div>
</template>

// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Tags
  }
}
</script>
