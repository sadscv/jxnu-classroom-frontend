<template>
  <a-card class="lookup-conditions" size="small">
    <a-form ref="form" layout="inline">
      <a-form-item label="选择日期">
        <a-date-picker format="YYYY-MM-DD"
                       v-model="conditions.class_time.date"
        >
        <template slot="renderExtraFooter" >
          <div class="align-center">
            <span v-if="this.datePickerMessage">{{this.datePickerMessage}}</span>
            <span v-else>当前可申请7日内教室</span>
          </div>
        </template>
        </a-date-picker>
    </a-form-item>
<!--      <a-form-item v-if="conditions.date">-->
<!--        星期{{['日','一', '二', '三', '四', '五', '六'][conditions.class_time.date.day()]}}-->
<!--      </a-form-item>-->
      <a-form-item label="选择时段">
        <a-tree-select v-model="conditions.class_time.timeslot" class="w-140px" :tree-data="treeData" tree-checkable :show-checked-strategy="SHOW_PARENT" placeholder="请选择时段" ></a-tree-select>
<!--        <MultipleCascader  v-model="conditions.search['class_time']" allow-clear />-->
<!--        <a-input class="w-100px" v-model="conditions.search['class_time']" allow-clear />-->
      </a-form-item>
      <a-form-item label="容量大于">
        <a-input-number class="w-80px" v-model.number="conditions.capacity" placeholder="不限" :min="0" :max="9999" />
      </a-form-item>
      <a-form-item label="教室号">
        <a-input class="w-100px" v-model="conditions.search['classroom_id']" allow-clear />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import {LookupConditionsMixin} from '../../mixins/LookupPanel';
  import {TreeSelect} from "ant-design-vue";
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  const SHOW_PARENT = TreeSelect.SHOW_PARENT;

  export default {
    name: 'LookupConditions',
    components: {},
    mixins: [LookupConditionsMixin],
    data() {
      return {
        treeData : [],
        value: [],
        SHOW_PARENT,
        datePickerMessage: null,
      };
    },

    methods: {
      moment,
      range(start, end) {
        const result = [];
        for (let i=start; i< end ; i++) {
          result.push(i);
        }
        return result;
      },
      disabledDate: function (current) {
        let open_period = 6
        if (this.$store.state.isAdmin) {
          open_period = 60
        }
        if (current && current < moment().add(open_period, 'days')) {
          if (this.$store.state.disabledDate) {
            let dd = this.$store.state.disabledDate;
            for (let index in dd) {
              if (current.isSame(moment(dd[index].date, 'YYYY-MM-DD'), "day")) {
                this.datePickerMessage = dd[index].message;
                return true
              }
            }
          }
          if (current > moment().startOf('day')) {
            return false
          }
        }
        return true
        // return current  && current < moment().add(7, 'days') && current < moment().startOf('day');
      },
      resetInputs: function () {
        this.conditions.class_time.date = null;
        this.conditions.class_time.timeslot = null;
        return true;
      },

      disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    },
    },

    created() {
      ['12节', '3节', '4节', '5节', '67节', '89节', '10-12节'].forEach((timeslot, index) => {
        // ['12节', '3节', '4节', '5节', '67节', '89节', '10-12节','午间(12:20-13:50)', '晚间(17:20-18:50)'].forEach((timeslot, index) => {
      let weekData = {
        title: timeslot,
        value: index+1,
        key: index+1,
        children: [],
      };
      this.treeData.push(weekData);
    })
    }
  };
</script>

<style scoped>
  .lookup-conditions {
    margin: 0 16px 16px;
  }

  .w-200px {
    width: 200px;
  }

  .w-140px {
    width: 140px;
  }

  .w-120px {
    width: 120px;
  }

  .w-100px {
    width: 100px;
  }

  .w-80px {
    width: 80px;
  }
  .w-60px {
    width: 60px;
  }
  .align-center {
    text-align: center;
  }
</style>