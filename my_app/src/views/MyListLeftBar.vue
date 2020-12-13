<template>
  <div class="left-bar">
    <MyListsSection />
    <div
      id="left_bar_bar"
      class="move-bar"
      @mousemove="widthChange($event)"
      @mousedown="widthChangeOn()"
      @mouseup="widthChangeOff()"
      @mouseover="widthChangeOff()"
    ></div>
  </div>
</template>

<script>
import MyListsSection from '../components/MyListsSection.vue'

export default {
  components: {
    MyListsSection,
  },
  data: function() {
    return {
      isWidthChange: false
    }
  },
  methods: {
    widthChange(event) {
      //console.log(event.offsetX)
      if (this.isWidthChange) {
        //console.log('move')
        //console.log(event)
        //console.log(event.srcElement.parentNode)
        if (event.clientX > 400) {
          event.srcElement.parentNode.style.width = '400px'
          event.srcElement.style.left = '400px'
        } else if (event.clientX > 180) {
          event.srcElement.parentNode.style.width = `${event.clientX}px`
          event.srcElement.style.left = `${event.clientX}px`
        } else {
          event.srcElement.parentNode.style.width = '180px'
          event.srcElement.style.left = '180px'
        }
      }
    },
    widthChangeOn() {
      //console.log('on')
      this.isWidthChange = true
      event.srcElement.classList.add('move-bar-active')
    },
    widthChangeOff() {
      //console.log('off')
      this.isWidthChange = false
      event.srcElement.classList.remove('move-bar-active')
    }
  }
}
</script>

<style scoped lang="scss">
.left-bar {
  height: 100%;
  background-color: #a3d2ca;
  width: 180px;
  min-width: 180px;
  float: left;
  padding: 10px 8px;
}
.move-bar {
  position: absolute;
  top: 32px;
  left: 180px;
  width: 1px;
  height: calc(100% - 32px);
  background-color: rgba(0, 0, 0, 0.5);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: -15px;
    z-index: 1;
    pointer-events: auto;
    width: 31px;
    content: '';
    background-color: transparent;
    cursor: ew-resize;
  }
}
.move-bar-active {
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: -350px;
    z-index: 1;
    pointer-events: auto;
    width: 701px;
    content: '';
    background-color: transparent;
    cursor: ew-resize;
  }
}
</style>
