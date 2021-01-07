export default {
  trace(...messages) {
    console.groupCollapsed(...messages)
    console.trace()
    console.groupEnd()
  }
}
