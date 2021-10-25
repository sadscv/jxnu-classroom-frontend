<template>
  <div >
    <a-tree-select
      v-model="value"
      style="width: 100%"
      :tree-data="treeData"
      tree-checkable
      :show-checked-strategy="SHOW_PARENT"
      placeholder="Please select"
    ></a-tree-select>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {

  name: 'MultipleCascader',
  data() {
    return {
      treeData : [],
      value: [],
      SHOW_PARENT,
    };
  },
  methods: {

  },

  created() {
    ['一', '二', '三', '四', '五', '六', '日'].forEach((week) => {
      let weekData = {
        title: '周'+week,
        value: '周'+week,
        key: '周'+week,
        children: [],
      };
      ['第12节', '第3节', '第4节', '第5节', '第67节', '第89节', '晚上'].forEach((date) => {
        let childData = {
          title: '周'+week+date,
          value: '周'+week+date,
          key: '周'+week+date,
        }
        weekData['children'].push(childData)
      })
      this.treeData.push(weekData);
    })
    }
  }
</script>

