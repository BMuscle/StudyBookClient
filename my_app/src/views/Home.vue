<template>
  <div class="home">
    <HelloWorld text_data="親から子へのデータ渡し"/>
    <Tags />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Tags from "@/components/tags.vue";
export default {
  name: "Home",
  components: {
    HelloWorld,
    Tags
  }
};
</script>
