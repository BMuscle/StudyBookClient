<template>
  <div>
    <table>
      <th>
        <h4 class="content">[{{ name }}]</h4>
      </th>
      <tr>
        <pre class="content">{{ JSON.stringify(data, null, '  ') }}</pre>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    data: Object
  }
}
</script>

<style>
.content {
  padding: 5px;
  margin: 0px;
  border: 1px dotted #333333;
}
</style>
