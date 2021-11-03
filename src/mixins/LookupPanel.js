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
      submitButtonLoading: false,
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
        allClassroom: this.$store.state.allClassroom,
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
      console.log(data);
      this.storageBusy = true;
      this.$store.dispatch('unselectClassroom', data);
    },
    pushSlectedClassroom(class_time, classrooms) {
      this.submitButtonLoading = true;
      console.log(class_time['date']);
      if ('date' in class_time) {
        class_time['date'] = moment(class_time['date']).toISOString().split('T')[0];
      }
      let data = {
        'class_time':class_time,
        'classrooms':classrooms,
      };
      return new Promise((resolve, reject) => {
        axios.post('/API/v1.0/apply_classroom/', data).then((response) => {
          console.log(response);
          this.submitButtonLoading = false;
          resolve();
        }).catch(() => {
          reject();
        })
      })
    },

  },
};

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
    getRawSelectedTime() {
      if (this.returnConditions.class_time) {
        return this.returnConditions.class_time;
      }
      return  null;
    },
  }
};
