<template>
  <a-config-provider :locale="zh_CN">
    <a-layout>
      <a-button type="primary">Button</a-button>
      <PageHeader />
      <PageSider />
      <PageContent ref="content" />
    </a-layout>
  </a-config-provider>
</template>
<!--<template>-->
<!--  <div id="app">-->
<!--    {{ message }}-->
<!--  </div>-->
<!--</template>-->

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import PageHeader from './components/layouts/PageHeader';
import PageSider from './components/layouts/PageSider';
import PageContent from './components/layouts/PageContent';
import {dataManagerMixin} from './mixins/common/dataManager';

export default {
  name: 'app',
  components: {
    PageHeader,
    PageSider,
    PageContent,
  },
  mixins: [dataManagerMixin],
  data() {
    return {
      zh_CN,
      message: '123'
    };
  },
  created() {
    this.$message.config({
      top: '11px',
      maxCount: 1,
    });
    // window.console.log(this.$route.query.id)
    this.updateData();
    addEventListener('storage', this.handleStorage);
    addEventListener('keydown', this.handleKeydown);
    clearInterval(this.updateTimer);
    this.updateTimer = setInterval(() => {
      this.$store.dispatch('updateAllInfosExtra').then((update) => {
        if (update) {
          this.updateData();
        }
      });
    }, 60000000);
  },
}
</script>


<style>
  /*noinspection CssUnusedSymbol*/
  button.ant-btn {
    overflow: hidden;
  }

  /*noinspection CssUnusedSymbol*/
  .page-sider.ant-layout-sider-collapsed + .page-content {
    margin-left: 0 !important;
  }

  /*noinspection CssUnusedSymbol*/
  .page-sider.ant-layout-sider-collapsed + .page-content .lookup-class-time-preview {
    display: none;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-hint {
    font-size: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-class-meta {
    font-size: 14px;
    margin: 16px 0 0;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-solving-list-class-meta-wrapper {
    margin: 8px 0 0 !important;
    font-size: 14px;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-class-meta-time {
    font-size: 12px;
    color: rgba(0, 0, 0, .45);
  }
  </style>