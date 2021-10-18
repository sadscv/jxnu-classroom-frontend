<template>
  <a-layout-sider
    class="page-sider"
    width="600px"
    theme="light"
    breakpoint="lg"
    collapsed-width="0"
    :trigger="null"
    @collapse="handleCollapse"
  >
  </a-layout-sider>
</template>

<script>

  export default {
    name: 'PageSider',
    components: {
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
