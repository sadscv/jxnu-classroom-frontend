<template>
  <a-layout-header ref="header" class="page-header">
    <a-config-provider :get-popup-container="() => $refs.header.$el">
      <a-menu class="header-menu" theme="light" mode="horizontal" :selectable="false">
        <a-menu-item class="header-title-wrapper">
          <div class="header-title-container">
            <div class="header-title">教室安排 <small>OL/Beta</small></div>
          </div>
        </a-menu-item>
        <a-sub-menu class="actions-menu-item actions-menu-item-right">
          <template slot="title">
            <a-icon type="info-circle" />
            关于
          </template>
          <a-menu-item>
<!--            <a target="_blank" rel="external nofollow">-->
<!--              <a-icon type="message" />-->
              意见反馈请致电:88120271
<!--            </a>-->
          </a-menu-item>
       </a-sub-menu>
      </a-menu>
    </a-config-provider>
  </a-layout-header>
</template>

<script>
  import {isMacLike} from '../../utils';

  export default {
    name: 'PageHeader',
    data() {
      return {
        undoTitle: isMacLike ? '撤销 ⌘Z' : '重做 Ctrl+Z',
        redoTitle: isMacLike ? '重做 ⇧⌘Z' : '恢复 Ctrl+Y',
      };
    },
    computed: {
    },
    methods: {
    },
  };
</script>

<style scoped>
  .page-header {
    user-select: none;
    background: white;
    position: fixed;
    z-index: 999;
    height: 64px;
    padding: 0;
    right: 0;
    left: 0;
    top: 0;
  }

  .header-title-wrapper {
    pointer-events: none;
    white-space: nowrap;
    padding: 0 24px;
    float: left;
  }

  .header-title-wrapper:before {
    background: url("../../assets/logo.png") no-repeat center center;
    background-size: contain;
    vertical-align: middle;
    display: inline-block;
    margin-right: 12px;
    user-select: none;
    height: 32px;
    content: " ";
    width: 32px;
  }

  .header-title-container {
    justify-content: center;
    flex-direction: column;
    vertical-align: middle;
    display: inline-flex;
    text-align: center;
    height: 64px;
  }

  .header-title {
    line-height: 28px;
    font-size: 18px;
    height: 28px;
    margin: 0;
  }

  .header-title small {
    font-size: 12px;
    opacity: 0.8;
  }

  .header-trimester {
    line-height: 20px;
    font-size: 12px;
    height: 20px;
    opacity: 0.6;
  }

  .header-menu {
    line-height: 63px;
  }

  .actions-menu-item {
    text-align: center;
    float: left;
  }

  .actions-menu-item-right {
    padding-right: 12px;
    float: right;
  }

  /*noinspection CssUnusedSymbol*/
  .actions-menu-item:not(.actions-menu-item-right) >>> .anticon {
    margin-right: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .header-menu >>> .ant-menu-item, .header-menu >>> .ant-menu-submenu {
    border-bottom: none !important;
  }
</style>
