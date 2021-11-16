<template>
  <div ref="wrapper">
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
            v-model.trim="teacher_id"
            ref="input"
            size="large"
            auto-focus
            @change="getTeacherInfo(teacher_id)"
          />
        </a-form-item>
        <a-form-item label="教师姓名">
          <h3>{{currentTeacher.姓名}}</h3>
        </a-form-item>
      <a-form-item label="责任单位">
        <a-select
            show-search
            placeholder="select a college"
            v-model="college_name"
        >
<!--          :filter-option="filterOption"-->
<!--          @focus="handleFocus"-->
<!--          @blue="handleBlur"-->
<!--          @change="handleChange"-->
          <a-select-option v-for="college in getCollegesInfo()" :key="college[0]">{{college[0]}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="联系方式">
        <a-input v-model="telephone"/>
      </a-form-item>
      <a-form-item label="申请事由">
        <a-textarea id="apply_reason" placeholder="请输入事由" label="validating" v-model="apply_reason"></a-textarea>
      </a-form-item>
    </a-form>
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
      teacher_id: null,
      college_name: null,
      telephone : null,
      apply_reason : null,
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
    rawSelectedData: {
      type:Object,
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
      return new Promise((resolve) => {
        this.$emit('pushSelectedClassroom',
            this.rawSelectedData,
            this.appliedClassrooms,
            this.currentTeacher.教号,
            this.currentTeacher.姓名,
            this.college_name,
            this.telephone,
            this.apply_reason
        )
        setTimeout(() => {
          this.visible = false;
        }, 0);
        resolve();
        })
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
          '教号': null,
          '姓名': null,
          '单位号': null,
          '单位名称': null,
        }
      }
    },
    getCollegesInfo() {
      return this.$store.state.allColleges;
    },
    savePDF(ticketId) {
      this.capturing = true;
      const hide = this.$message.loading('正在生成...');
      this.$nextTick(() => {
          this.$showSaveImageDialog(ticketId)
        }).catch(() => {
          this.$message.error('截图失败！');
        }).finally(() => {
          this.capturing = false;
          hide();
        });
    },
  },
};
</script>