<template>
  <div >
    <a-form class="apply-info-wrapper" :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="申请时间">
        <a>{{selectedDate}}</a>
      </a-form-item>
      <a-form-item label="责任教师教号" >
        <a-input v-model.trim="value" ref="input" class="w-120px" size="middle" maxlength="10" auto-focus
                 :placeholder="`${originalValue}`" @change="validate" />
      </a-form-item>
    <a-form-item label="责任教师姓名">
    </a-form-item>
    <a-form-item label="责任单位">
      <a-select
        show-search
        placeholder="select a college"
        style="width:120px"
      >
<!--          :filter-option="filterOption"-->
<!--          @focus="handleFocus"-->
<!--          @blue="handleBlur"-->
<!--          @change="handleChange"-->
      <a-select-option v-for="college in colleges" :key="college">{{college}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
        label="申请事由"
    >
      <a-textarea id="apply_reason" placeholder="请输入事由" label="validating"></a-textarea>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
  </div>
</template>


<script>
import {LookupResultMixin} from '../mixins/LookupPanel';

  export default {
    name: 'SubmitPanel',
    components: {
    },
    data() {
      return {
        colleges : ['1学院','2学院'],
        form: this.$form.createForm(this, {name:'infoForm'}),
        labelCol: {
          xs: {span:24},
          sm: {span:4},
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      }
    },
    props: {
      selectedDate: {
        type:String,
      }

    },
    methods: {
      handleClassCardClick(class_id) {
        window.console.log(class_id);
        return new Promise((() => {
        }))
      },
      getTeacherInfo(teacher_id) {
        return new Promise(() => {
          let teacher = this.$store.state.currentTeacher;
          console.log(teacher_id, teacher);
        })
      },
    },

    mixins: [LookupResultMixin],
  };
</script>

<style>
  .apply-info-wrapper {
    padding: 16px 16px 0;
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
