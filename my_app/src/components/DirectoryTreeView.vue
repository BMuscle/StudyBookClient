/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      <DirectoryTreeList :directories="directories" />
    </ul>
  </div>
</template>
<script>
import DirectoryTreeList from './DirectoryTreeList.vue'
import Directory from '@/models/Directory'
export default {
  components: {
    DirectoryTreeList
  },
  data: function() {
    return {}
  },
  computed: {
    directories() {
      return Directory.query()
        .where('parent_inode', null)
        .with('child_directories')
        .get()
    }
  },
  created: function() {
    Directory.insert({
      data: {
        inode: 1,
        parent_inode: null,
        directory_name: 'app',
        path_from_root: 'app'
      }
    }),
      Directory.insert({
        data: {
          inode: 2,
          parent_inode: 1,
          directory_name: 'test',
          path_from_root: 'app/test'
        }
      }),
      Directory.insert({
        data: {
          inode: 3,
          parent_inode: 2,
          directory_name: 'test2',
          path_from_root: 'app/test/test2'
        }
      }),
      Directory.insert({
        data: {
          inode: 4,
          parent_inode: null,
          directory_name: 'hoge',
          path_from_root: 'hoge'
        }
      }),
      Directory.insert({
        data: {
          inode: 5,
          parent_inode: 1,
          directory_name: 'huga',
          path_from_root: 'app/huga'
        }
      }),
      Directory.insert({
        data: {
          inode: 6,
          parent_inode: 3,
          directory_name: 'test3',
          path_from_root: 'app/test/test2/test3'
        }
      })
  }
}
</script>

<style></style>
