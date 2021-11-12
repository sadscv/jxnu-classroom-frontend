<template>
  <div>
    <a-button
        type="primary"
        @click="showModal"
    >
      确定
    </a-button>
    <a-modal
      :visible="visible"
      title='提交申请'
      okText='提交申请'
      @cancel="() => { handleCancel() }"
      @ok="() => { handlePush() }"
    >
      <a-form class="apply-info-wrapper" :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="申请时间"> <a>{{selectedDate[0]}} {{selectedDate[1]}}</a> </a-form-item>
        <a-form-item label="申请教室"> <a>{{Object.keys(appliedClassrooms)}}</a></a-form-item>
        <a-form-item label="教师教号" >
          <a-input
            v-model.trim="value"
            ref="input"
            size="large"
            auto-focus
            @change="getTeacherInfo(value)"
          />
        </a-form-item>
        <a-form-item label="教师姓名">
          <h3>{{currentTeacher.姓名}}</h3>
        </a-form-item>
      <a-form-item label="责任单位">
        <a-select
            show-search
            placeholder="select a college"
        >
<!--          :filter-option="filterOption"-->
<!--          @focus="handleFocus"-->
<!--          @blue="handleBlur"-->
<!--          @change="handleChange"-->
        <a-select-option v-for="college in getCollegesInfo()" :key="college[0]">{{college}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="联系方式">
        <a-input auto-focus/>
      </a-form-item>
      <a-form-item label="申请事由">
        <a-textarea id="apply_reason" placeholder="请输入事由" label="validating"></a-textarea>
      </a-form-item>
    </a-form>
<!--      <a-form layout='vertical' :form="form">-->
<!--        <a-form-item label='Title'>-->
<!--          <a-input-->
<!--            v-decorator="[-->
<!--              'title',-->
<!--              {-->
<!--                rules: [{ required: true, message: 'Please input the title of collection!' }],-->
<!--              }-->
<!--            ]"-->
<!--          />-->
<!--        </a-form-item>-->
<!--        <a-form-item label='Description'>-->
<!--          <a-input-->
<!--            type='textarea'-->
<!--            v-decorator="['description']"-->
<!--          />-->
<!--        </a-form-item>-->
<!--        <a-form-item class='collection-create-form_last-form-item'>-->
<!--          <a-radio-group-->
<!--            v-decorator="[-->
<!--              'modifier',-->
<!--              {-->
<!--                initialValue: 'private',-->
<!--              }-->
<!--            ]"-->
<!--          >-->
<!--              <a-radio value='public'>Public</a-radio>-->
<!--              <a-radio value='private'>Private</a-radio>-->
<!--            </a-radio-group>-->
<!--        </a-form-item>-->
<!--      </a-form>-->
    </a-modal>
  </div>
</template>

<script>


export default {
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, {name:'infoForm'}),
      currentTeacher: {},
      colleges : {},
      labelCol: {
          xs: {span:24},
          sm: {span:4},
        },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
  },
  props: {
    selectedDate: {
      type:Array,
    },
    appliedClassrooms: {
      type:Object,
    }
  },
  computed: {
    // appliedClassroomId() {
    //   return this.appliedClassrooms.keys()
    // }

  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    handlePush() {
      this.$emit('pushSelectedClassroom');
    },
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('Received values of form: ', values);
        form.resetFields();
        this.visible = false;
      });
    },
    getTeacherInfo(teacher_id) {
      let all_teachers = this.$store.state.allTeachers;
      console.log(teacher_id, all_teachers);
      if (teacher_id in all_teachers) {
        this.currentTeacher = all_teachers[teacher_id];
      }else {
        this.currentTeacher = {
          '姓名': null,
          '单位号': null,
        }
      }
    },
    getCollegesInfo() {
      return this.$store.state.allColleges;
    }
  },
};
</script>