import PromiseWorker from 'promise-worker';
import axios from "axios";
import moment from "moment";

export const LookupPanelMixin = {
  data() {
    return {
      promiseWorker: null,
      rows: [],
      storageBusy: false,
      timer: null,
      returnConditions: {},
      clientIp: '0.0.0.0',
      submitButtonLoading: false,
      submitButtonDisabled: false,
      visible: false,
      beginDate: null,
      endDate: null
    };
  },
  mounted() {
    this.promiseWorker = new PromiseWorker(new Worker('../workers/filter.js', {type: 'module'}));
    this.filter(this.$refs.conditions.conditions).then((rows) => {
      this.rows = rows;
    });
  },
  watch: {
    '$store.state.reservedClassroom'() {
      this.countdown(0); // 避免重复执行筛选
      if (this.$store.state.reservedClassroom && this.$store.state.reservedClassroom !== {}) {
        this.submitButtonDisabled = false;
      }
    },
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    countdown(delay) {
      let tmp_conditions =JSON.parse(JSON.stringify(this.$refs.conditions.conditions));
      if (this.$refs.conditions.conditions.class_time['date']) {
        tmp_conditions.class_time['date'] = this.$refs.conditions.conditions.class_time['date'].toDate();
      }
      this.returnConditions = tmp_conditions;
      this.storageBusy = true;
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.filter(tmp_conditions).then((rows) => {
          this.rows = rows;
          this.storageBusy = false;
        });
      }, delay);
    },
    filter(conditions) {
      return this.promiseWorker.postMessage({
        allClassroom: this.$store.state.usedClassrooms,
        reservedClassroom: this.$store.state.reservedClassroom,
        classroomTableRows: this.$store.getters.ClassroomTableRows,
        classList: this.$store.state.classList,
        conditions,
      });
    },
    selectClassroom(data, select) {
      this.storageBusy = true;
      this.$store.dispatch(select ? 'reserveClassroomThenSelect' : 'reserveClassroom', data);
    },
    unselectClassroom(data) {
      this.storageBusy = true;
      this.$store.dispatch('unselectClassroom', data);
    },
    commitSelectedClassroom(class_time, classrooms) {
      console.log(class_time, classrooms);
      this.visible= true;
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
    getRawSelectedTime() {
      if (this.returnConditions.class_time) {
        return this.returnConditions.class_time;
      }
      return  null;
    },
    pushSelectedClassroom(apply_building, class_time, classrooms, teacher_id, teacher_name, college_name, telephone, apply_reason, directSubmit=false) {
      console.log(class_time, classrooms, teacher_name, );
      fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(response => {
            this.clientIp = response.ip;
          });
      this.submitButtonLoading = true;
      if ('date' in class_time) {
        if (moment(class_time['date'])) {
          class_time['date'] = moment(class_time['date']).format("yyyy-MM-DD");
        }
      }
      let data = {
        'class_time':class_time,
        'classrooms':classrooms,
        'teacher_id': teacher_id,
        'teacher_name':teacher_name,
        'college_name':college_name,
        'telephone': telephone,
        'apply_reason': apply_reason,
        'apply_building': apply_building,
        'client_ip': this.clientIp,
      };
      return new Promise((resolve) => {
        axios.post('/API/v1.0/apply_classroom/', data).then((response) => {
          console.log(response.data.code);
          if (response.data.code && response.data.code.toString().startsWith('400')) {
            this.$message.warning(response.data.message);
            resolve();
          }else {
            this.$message.success('申请成功');
            this.updateData();
            this.$store.dispatch('clearReservedClassroom');
            if(!directSubmit) {
              this.$refs.popuppanel.ticketId = response.data['ticket_id'];
            }
            resolve();
          }
        }).catch(() => {
          this.$message.error('申请失败 ，请刷新页面重试！');
        })
      })
    },
    updateData() {
      let currentBuilding = this.$store.state.currentBuilding
      let params = {
        'builidng': currentBuilding ? currentBuilding : '惟义楼',
        'beginDate': moment(this.beginDate).format('YYYY-MM-DD'),
        'endDate': moment(this.endDate).format('YYYY-MM-DD')
      }
      this.$store.dispatch('updateAllClassroomInfo', params).then(() => {
      this.$store.dispatch('refreshUpdateTime', moment.now())
      console.log(moment.now())
          this.$message.success('课程数据已更新！');
        }).catch(()=> {
          this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
        }).finally(()=> {
        });
    }

  },
};

export const LookupResultMixin = {
  methods: {

  }
}

export const LookupConditionsMixin = {
  data() {
    return {
      conditions: {
        search: {
          'classroom_id': '',
          'building': '',
        },
        capacity: '',
        class_time: {
          date: null,
          timeslot: null,
        },
      },
    };
  },
  watch: {
    conditions: {
      handler() {
        if (this.conditions.capacity === '0' || this.conditions.capacity === 0 || parseInt(this.conditions.capacity) === 0) {
          this.conditions.capacity = '';
        }
        this.$emit('filter');
      },
      deep: true,
    },

  },
  methods: {

  }
};
