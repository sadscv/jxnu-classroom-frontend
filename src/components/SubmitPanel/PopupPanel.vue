<template>
  <div ref="wrapper">
    <a-dropdown-button
        type="primary"
        @click="showModal"
    >
      确定
      <a-menu slot="overlay" >
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
        <a-menu-item  @click="handlePushAdmin" :disabled="$store.state.isAdmin === false">
          <template v-if="$store.state.isAdmin"> 直接提交  </template>
        </a-menu-item>
      </a-menu>
    </a-dropdown-button>
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
            v-decorator="['teacher_id', { rules: [{ required: true, message: '请输入教号' }] }]"
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
          <a-select-option v-for="college in getCollegesInfo().sort()" :key="college">{{college}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="联系方式">
        <a-input
            v-model="telephone"
            v-decorator="['telephone', { rules: [{ required: true, message: '请输入联系方式' }] }]"
        />
      </a-form-item>
      <a-form-item
          label="申请事由"
          :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-textarea
            id="apply_reason"
            placeholder="请输入事由"
            label="validating"
            v-model="apply_reason"
            v-decorator="['reason', { rules: [{ required: true, message: '请输入申请事由' }] }]"
        />
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
      isAdmin: this.$store.state.isAdmin,
      form: this.$form.createForm(this, {name:'infoForm'}),
      currentTeacher: {},
      colleges : {},
      teacher_id: null,
      college_name: null,
      telephone : null,
      ticketId: 0,
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
    },
  },
  watch: {
    ticketId: {
      handler() {
        this.savePDF(this.ticketId);
      }
    }
  },
  computed: {
    // appliedClassroomId() {
    //   return this.appliedClassrooms.keys()
    // }

  },
  methods: {
    showModal() {
      if (Object.keys(this.appliedClassrooms).length === 0) {
        this.$message.error('请选择至少1间教室');
      }else if (Object.keys(this.appliedClassrooms).length > 10) {
        this.$message.error('一次性申请10间以上教室的大型活动,请提前联系教务处教学管理科：88120271');
      }else {
        this.visible = true;
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handlePush() {
      return new Promise((resolve) => {
        this.form.validateFields((err) => {
          if (!err) {
            this.$emit('pushSelectedClassroom',
            this.$store.state.currentBuilding,
            this.rawSelectedData,
            this.appliedClassrooms,
            this.currentTeacher.教号,
            this.currentTeacher.姓名,
            this.college_name,
            this.telephone,
            this.apply_reason,
         )
         setTimeout(() => {
           this.visible = false;
         }, 0);
         resolve();
        }
        })
      })
    },
    handlePushAdmin() {
      return new Promise((resolve) => {
        this.$emit('pushSelectedClassroom',
            this.$store.state.currentBuilding,
            this.rawSelectedData,
            this.appliedClassrooms,
            '000000',
            '待定',
            '教务处',
            '88120271',
            '管理员操作',
            true,
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
      let result = []
      let allColleges = this.$store.state.allColleges
      // result = Object.keys(allColleges)
      // for (let prop in ['1','2','3','4']) {
        for (let key in allColleges) {
          if (allColleges[key].单位性质号 in ['1','2','3','4','5','6','7']) {
            result.push(key);
          }
        }
      // }

      return result.sort();
    },
    savePDF(ticketId) {
      this.capturing = true;
      const hide = this.$message.loading('正在生成...');
      this.$nextTick(() => {
          this.$showSaveImageDialog(ticketId);
        }).catch(() => {
          this.$message.error('生成失败！');
        }).finally(() => {
          this.capturing = false;
          hide();
        });
    },
  },
};
</script>