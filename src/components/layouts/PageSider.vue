<template>
  <a-layout-sider
    class="page-sider"
    width="1200px"
    theme="light"
    breakpoint="lg"
    collapsed-width="0"
    :trigger="null"
    @collapse="handleCollapse"
  >
    <ClassroomTable @click="$emit('click')" />
  </a-layout-sider>
</template>

<script>
import ClassroomTable from '../ClassroomTable';

  export default {
    name: 'PageSider',
    components: {
      ClassroomTable,
    },
    methods: {
      handleCollapse(collapsed) {
        this.$emit('collapse', collapsed);
      },
    },
  };
</script>

<style scoped>
  .page-sider {
    position: fixed;
    overflow: auto;
    top: 64px;
    bottom: 0;
    left: 0;
  }
</style>
