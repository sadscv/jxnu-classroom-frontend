<template>
  <a-layout-content class="page-content">
    <a-spin size="large" tip="正在加载…" :spinning="!$store.state.loaded">
      <a-tabs v-model="activeTab" class="content-tabs" type="card">
        <a-tab-pane v-if="showScheduleTable" tab="课表" key="schedule_table">
        </a-tab-pane>
        <a-tab-pane tab="检索" key="lookup">
          <LookupPanel ref="lookuppanel"/>
        </a-tab-pane>

        <a-dropdown slot="tabBarExtraContent"  :getTooltipCotainer="trigger => trigger.parentNode">
          <a-button class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a v-if="this.$store.state.currentBuilding">
                {{this.$store.state.currentBuilding}}
              </a>
              <a v-else>
                选择楼栋
              </a>
            <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item style="z-index: 1" v-for="(building, index2) in allBuildings " :key="index2" @click="handleBuildingListClick(building)" >
              {{ building}}
            </a-menu-item>
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
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://github.com/sadscv/jxnu-classroom-frontend" target="_blank">sadscv
        </a>.
          All Rights Reserved.
        </div>
        <div>
          数据来源: <a href="http://jwc.jxnu.edu.cn/" target="_blank">江西师范大学</a> 版权归江西师范大学所有
        </div>
      </div>
      <a-back-top class="back-top" />
    </a-spin>

  </a-layout-content>
</template>

<script>
  import LookupPanel from '../LookupPanel';

  export default {
    name: 'PageContent',
    components: {
      LookupPanel,
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
        imageBlob: null,
        allBuildings: ['惟义楼','新实验楼', '田家炳楼', '第二教学大楼'],
        selectedBuilding: null,
      };
    },
    computed: {
    },
    watch: {
    },
    methods: {
      handleBuildingListClick(building) {
        this.selectedBuilding = building;
        this.$store.state.currentBuilding = building;
        this.updateData(building)
      },
      updateData(building) {
        setTimeout(() => {
        this.$message.loading('正在检查基础数据更新...', 0);
      }, 0)
        // const hide = this.$message.loading('正在检查数据更新...', 0);
        this.$store.dispatch('updateFromNullStorage').then(() => {
        this.$store.dispatch('checkUpdateAllInfos').then((data) => {
          if (data != null) {
            this.$store.dispatch('updateAllClassroomInfo', building).then(() => {
              this.$message.success('基础数据已更新！');
            }).catch(()=> {
              this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
            }).finally(()=> {
              this.$store.commit('LOADED', true);
            });
          } else {
            this.$store.commit('LOADED', true);
          }
        }).catch(()=>{
          this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
          this.$store.commit('LOADED', true);
        }).finally(()=>{
          this.$destroyAll();
          this.$refs.lookuppanel.$refs.conditions.resetInputs()
          // hide();

        });

      })

        // this.$destroyAll();
        // this.$store.dispatch('updateAllClassroomInfo', this.$store.state.currentBuilding).then(() => {
        //
        //   const hide = this.$message.loading('正在更新基础数据...', 0);
        //   this.$store.commit('LOADED', true);
        //   hide();
        //   this.$message.success('课程数据已更新！');
        // }).catch(()=> {
        //   this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
        // }).finally(()=> {
        // });
    }


    },
    beforeDestroy() {
    },
  };
</script>

<style scoped>
  .page-content {
    min-height: calc(100vh - 64px);
    transition: all 0.2s ease;
    margin: 64px 0 0 70%;
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
