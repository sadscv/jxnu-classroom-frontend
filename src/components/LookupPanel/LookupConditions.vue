<template>
  <a-card class="lookup-conditions" size="small">
    <a-form ref="form" layout="inline">
      <a-form-item label="教室号">
        <a-input class="w-100px" v-model="conditions.search['classroom_id']" allow-clear />
      </a-form-item>
      <a-form-item label="上课时间">
        <a-input class="w-100px" v-model="conditions.search['class_time']" allow-clear />
      </a-form-item>
      <a-form-item label="校区">
        <a-select v-model="conditions.search['campus']">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="瑶湖">瑶湖</a-select-option>
          <a-select-option value="青山湖">青山湖</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="容量不低于">
        <a-input-number class="w-80px" v-model.number="conditions.number" placeholder="不限" :min="0" :max="9999" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import {LookupConditionsMixin} from '../../mixins/LookupPanel';

  export default {
    name: 'LookupConditions',
    mixins: [LookupConditionsMixin],
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
