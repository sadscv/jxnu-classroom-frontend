<template>
  <div class="lookup-panel-wrapper">
    <LookupConditions ref="conditions" @filter="countdown(300, true)" />
    <!--suppress JSUnusedGlobalSymbols -->
    <a-divider />
    <div slot="content" class="selected-classroom" v-if="getSelectedTimeslot() !== null">
      <strong>已选时段：</strong>
      <div ></div>
      <a>{{ getSelectedTimeslot()[0] }} {{ getSelectedTimeslot()[1] }}</a>
      <a-divider />
      <strong>已选教室：</strong>
      <a-tag
          v-for="room in getSelectedClassroom()"
          :key="room.id"
          color="red"
          closable
          @close="unselectClassroom(room.id)"
      >
        {{room.id}}
      </a-tag>
      <a-button
          type="primary"
          :loading=submitButtonLoading
          @click="pushSelectedClassroom(getRawSelectedTime(), getSelectedClassroom())"
      >
        提交
      </a-button>
      <PopupPanel :selected-date="getSelectedTimeslot()" :applied-classrooms="getSelectedClassroom()"/>
    </div>
    <a-divider />
    <a-table
      ref="table"
      class="table"
      :data-source="rows"
      :locale="{emptyText: '没有匹配的记录'}"
      :pagination="{position: 'bottom', showTotal: total => `${total} 条记录`}"
    >
      <a-table-column title="可用教室列表" data-index="classroom" >
        <template v-slot="classroom" >
          <a target="_blank" rel="external nofollow">
<!--            <strong>{{ // classroom.capacity }}</strong>-->
            <strong>{{ classroom.classroom_id }} | </strong>{{classroom.capacity}}座 | <small>{{classroom.building}}</small>
          </a>
          <br />
        </template>
      </a-table-column>
<!--      <a-table-column  :title="$store.state.reservedClassroom"  width="220px">-->
<!--      </a-table-column>-->
      <a-table-column data-index="action" width="160px">
        <div slot="title" class="about-data-wrapper">
          <a-popover placement="leftBottom">
            <div slot="content" class="about-data">
              所有数据<strong>【非实时】</strong>，可能与实际情况存在误差，仅供参考。<br />
              更新时间：
              <a-tag>
                <a-icon type="clock-circle" />
                <a-divider type="vertical" />
                <span>123</span>
<!--                <span>{{ new Date($store.state.allClassesExtraUpdateTime).toLocaleString() }}</span>-->
              </a-tag>
            <a-button type="primary" size="small" class="about-data-update-button" @click="updateData()">更新数据</a-button>
            </div>
            <a-button size="small" type="link" icon="info-circle">说明</a-button>
          </a-popover>
        </div>
        <template v-slot="action">
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-dropdown-button
            v-if="!action.isSelected"
            type="primary"
            :disabled="storageBusy"
            @click="selectClassroom(action.row, false)"
          >
            <a-icon type="plus-circle" />
            选择
            <a-menu slot="overlay">
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item @click="selectClassroom(action.row, true)">
                <template>选择并提交</template>
              </a-menu-item>
            </a-menu>
          </a-dropdown-button>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-dropdown-button
            v-else
            type="dashed"
            :disabled="storageBusy"
            @click="unselectClassroom(action.row['classroom_id'])"
          >
            <a-icon type="minus-circle" />
            已选
            <a-menu slot="overlay" >
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item v-if="action.isSelected" @click="unselectClassroom(action.row['classroom_id'])">
                <template> 取消选择 </template>
              </a-menu-item>
            </a-menu>
        </a-dropdown-button>
        </template>
      </a-table-column>
    </a-table>

    </div>
</template>

<script>
  import LookupConditions from './LookupConditions';
  import {LookupConditionsMixin, LookupPanelMixin} from '../../mixins/LookupPanel';
  import ATableColumn from "ant-design-vue/es/table/Column";
  import moment from "moment";
  import PopupPanel from "@/components/SubmitPanel/PopupPanel";

  export default {
    name: 'LookupPanel',
    components: {
      PopupPanel,
      ATableColumn,
      LookupConditions,
    },
    methods: {
      handleClassCardClick(class_id) {
        window.console.log(class_id);
        return new Promise((() => {
        })
      )
      },
      getSelectedClassroom() {
        return this.$store.state.reservedClassroom;
      },

      getSelectedTimeslot() {
        if (this.getRawSelectedTime()) {
          let class_time = this.getRawSelectedTime();
          let timeslots = [];
          let date = null;
          if (class_time['timeslot']) {
            class_time['timeslot'].forEach((ts) => {
              timeslots.push(['12节', '3节', '4节', '5节', '67节', '89节', '10-12节','午间(12:20-13:50)', '晚间(17:20-18:50)'][ts-1]);
            })
          }
          if (class_time['date']) {
            date = moment(class_time['date']).toISOString().split('T')[0];
          }
          if (timeslots.length !== 0 && date!== null) {
            return [date , timeslots]
          }
        }
        return  null;
      },

      // processSelectedTime() {
      //   // if ('date' in selectedTime) {
      //   //   return selectedTime['date'];
      //   // }
      //   return this.getSelectedTime();
      // }


    },

    mixins: [LookupConditionsMixin, LookupPanelMixin],
  };
</script>

<style scoped>
  .lookup-panel-wrapper {
    padding-top: 16px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-pagination {
    margin-left: 16px;
    margin-right: 16px;
  }

  .table >>> .ant-table-thead th {
    white-space: nowrap;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-thead th, .table >>> .ant-table-row td {
    padding: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-thead th:first-child, .table >>> .ant-table-row td:first-child {
    padding-left: 16px;
  }

  .credit-badge {
    position: relative;
    margin-left: 7px;
    top: -1px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    background: white;
    color: #999999;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }

  .id-info {
    color: rgba(0, 0, 0, 0.35);
    font-size: 12px;
  }

  .teacher-id-info {
    display: inline-block;
    width: 60px;
  }

  .conflict-info {
    display: inline-block;
    padding-bottom: 2px;
    font-size: 12px;
    color: rgba(244, 67, 54, 0.8);
  }

  .selected-info {
    display: inline-block;
    padding-bottom: 2px;
    font-size: 12px;
    color: #52c41a;
  }

  .limitation-tag {
    margin-top: 2px;
  }

  .detail-venue {
    color: rgba(0, 0, 0, 0.35);
    text-overflow: ellipsis;
    vertical-align: middle;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    width: 60px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-row:hover .detail-venue {
    white-space: inherit;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-pagination.ant-table-pagination:first-child {
    margin-top: 0;
  }

  .about-data-wrapper {
    text-align: right;
  }

   .about-data-update-button{
     margin-left: 5%;
  }


  .about-data {
    line-height: 2;
  }

  .selected-classroom {
    line-height: 2;
    margin-left: 15px;
  }

  .course-intro-link {
    border-bottom: 1px solid transparent;
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
    padding-bottom: 2px;
    line-height: 24px;
  }

  /*noinspection CssUnusedSymbol*/
  .course-intro-link:focus, .table >>> .ant-table-row:hover .course-intro-link {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.35);
  }

  .course-intro-link:hover {
    color: #64B5F6;
  }

  .course-intro-link:active {
    color: #1976D2;
  }
</style>


