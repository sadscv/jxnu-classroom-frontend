<template>
  <a-config-provider :locale="zh_CN">
    <a-layout>
      <a-button type="primary">Button</a-button>
      <div id="app">
        {{ message }}
      </div>
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

export default {
  name: 'app',
  components: {
    PageHeader,
    PageSider,
    PageContent,
  },

  data() {
    return {
      zh_CN,
      message: '123'
    };
  }
}
</script>
