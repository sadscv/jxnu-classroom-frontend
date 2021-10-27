import PromiseWorker from 'promise-worker';

export const LookupPanelMixin = {
  data() {
    return {
      promiseWorker: null,
      rows: [],
      storageBusy: false,
      timer: null,
    };
  },
  mounted() {


    this.promiseWorker = new PromiseWorker(new Worker('../workers/filter.js', {type: 'module'}));
    this.filter(this.$refs.conditions.conditions).then((rows) => {
      this.rows = rows;
    });
  },
  watch: {
    '$store.state.allClassroom'() {
      this.countdown(0, false); // 避免重复执行筛选
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
        classroomTableRows: this.$store.getters.ClassroomTableRows,
        classList: this.$store.state.classList,
        conditions,
      });
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
};
