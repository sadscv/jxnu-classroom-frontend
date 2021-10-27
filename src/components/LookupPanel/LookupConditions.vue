<template>
  <a-card class="lookup-conditions" size="small">
    <a-form ref="form" layout="inline">
      <a-form-item label="教室号">
        <a-input class="w-100px" v-model="conditions.search['classroom_id']" allow-clear />
      </a-form-item>
      <a-form-item label="选择日期">
        <a-date-picker format="YYYY-MM-DD"
                       :disabled-date="disabledDate"
                       class="w-140px"
                       v-model="conditions.class_time.date"
        />
      </a-form-item>
<!--      <a-form-item v-if="conditions.date">-->
<!--        星期{{['日','一', '二', '三', '四', '五', '六'][conditions.class_time.date.day()]}}-->
<!--      </a-form-item>-->
      <a-form-item label="上课时间">
        <a-tree-select v-model="conditions.class_time.timeslot" class="w-140px" :tree-data="treeData" tree-checkable :show-checked-strategy="SHOW_PARENT" placeholder="Please select" ></a-tree-select>
<!--        <MultipleCascader  v-model="conditions.search['class_time']" allow-clear />-->
<!--        <a-input class="w-100px" v-model="conditions.search['class_time']" allow-clear />-->
      </a-form-item>

      <a-form-item label="容量大于">
        <a-input-number class="w-80px" v-model.number="conditions.capacity" placeholder="不限" :min="0" :max="9999" />
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
      disabledDate(current) {
        return current && current < moment().endOf('day');
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
      ['12节', '3节', '4节', '5节', '67节', '89节', '10-12节','午间(12:20-13:50)', '晚间(17:20-18:50)'].forEach((timeslot, index) => {
      let weekData = {
        title: timeslot,
        value: index,
        key: index,
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
</style>