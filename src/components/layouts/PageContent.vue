<template>
  <a-layout-content class="page-content">
    <a-spin size="large" tip="正在加载…" :spinning="!$store.state.loaded">
      <a-tabs v-model="activeTab" class="content-tabs" type="card">
        <a-tab-pane v-if="showScheduleTable" tab="课表" key="schedule_table">
        </a-tab-pane>
        <a-tab-pane tab="检索" key="lookup">
          <LookupPanel />
        </a-tab-pane>

        <a-dropdown slot="tabBarExtraContent"  :getTooltipCotainer="trigger => trigger.parentNode">
          <a-button class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a v-if="selectedCollege">
              </a>
              <a v-else-if="selectedCollege">
                def{{ selectedCollege }}
              </a>
              <a v-else>
                选择楼栋
              </a>
            <a-icon type="down" />
          </a-button>
            <a-menu slot="overlay">

            </a-menu>
        </a-dropdown>


        <!--<a-dropdown-button slot="tabBarExtraContent" class="tabs-actions" @click="quickInputting">-->
          <!--<a-icon type="rocket" />-->
          <!--快捷选课...-->
          <!--<a-menu slot="overlay">-->
            <!--<a-menu-item @click="exportDialogVisible = true">-->
              <!--<a-icon type="export" />-->
              <!--导出已选课程文本...-->
            <!--</a-menu-item>-->
            <!--<a-menu-divider />-->
            <!--<a-menu-item @click="backupAndRestoreDialogVisible = true">-->
              <!--<a-icon type="database" />-->
              <!--备份与还原...-->
            <!--</a-menu-item>-->
          <!--</a-menu>-->
        <!--</a-dropdown-button>-->
      </a-tabs>
      <div class="content-footer">
        <div>
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://github.com/sadscv" target="_blank">sadscv
        </a>.
          All Rights Reserved.
        </div>
        <div>
          数据来源: <a href="http://jwc.jxnu.edu.cn/" target="_blank">江西师范大学</a> 版权归江西师范大学所有
        </div>
      </div>
      <a-back-top class="back-top" />
    </a-spin>
    <a-modal v-model="saveImageDialogVisible" :footer="null" destroy-on-close>
      <SaveImageDialog :blob="imageBlob" @ok="saveImageDialogVisible = false" :ticketId="ticketId"/>
    </a-modal>
  </a-layout-content>
</template>

<script>
  import LookupPanel from '../LookupPanel';
  import Vue from "vue";
  import SaveImageDialog from "@/components/modals/SaveImageDialog";

  export default {
    name: 'PageContent',
    components: {
      LookupPanel,
      SaveImageDialog,
      // BackupAndRestoreDialog,
      // ColorSeedDialog,
      // ExportDialog,
      // ReservedClassesList,
      // ScheduleTable,
    },
    props: {
      showScheduleTable: {
        type: Boolean,
      }
    },
    data() {
      return {
        activeTab: 'lookup',
        quickInputtingWindow: null,
        exportDialogVisible: false,
        backupAndRestoreDialogVisible: false,
        saveImageDialogVisible: false,
        imageBlob: null,
        selectedCollege: null,
        ticketId : null,
      };
    },
    computed: {
    },
    watch: {
    },
    created() {
      Vue.prototype.$showSaveImageDialog = (ticketID) => {
        // this.imageBlob = blob;
        this.ticketId = ticketID
        this.saveImageDialogVisible = true;
      };
    },
    beforeDestroy() {
    },
  };
</script>

<style scoped>
  .page-content {
    min-height: calc(100vh - 64px);
    transition: all 0.2s ease;
    margin: 64px 0 0 1200px;
    padding: 8px;
  }

  /*noinspection CssUnusedSymbol*/
  .page-content >>> .ant-spin-container::after {
    background-color: #f0f2f5;
  }

  .tabs-actions {
    position: relative;
    top: -4px;
  }

  .content-footer {
    text-align: center;
    line-height: 2;
    font-size: 12px;
    padding: 32px 8px;
  }

  .content-footer a {
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
  }

  .content-footer a:hover {
    color: rgba(0, 0, 0, 0.35);
  }

  .beian {
    margin: 0 10px;
  }

  .mps-beian:before {
    background: url("../../assets/mps.png") no-repeat center center;
    vertical-align: text-bottom;
    background-size: contain;
    transition: opacity 0.2s;
    display: inline-block;
    margin-right: 5px;
    content: " ";
    opacity: 0.8;
    height: 16px;
    width: 16px;
  }

  .mps-beian:hover:before {
    opacity: 0.7;
  }

  .alternate-to-desktop {
    margin-top: 16px;
  }

  .back-top {
    bottom: 20px;
    right: 20px;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-content {
    margin-top: -16px;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-content > .ant-tabs-tabpane {
    background: white;
    padding: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar {
    border-color: white !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent !important;
    background: transparent !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar .ant-tabs-tab-active {
    border-color: white !important;
    background: white !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-nav {
    user-select: none;
  }
</style>
