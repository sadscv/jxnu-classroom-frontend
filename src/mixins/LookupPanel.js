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
      this.storageBusy = true;
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.filter(this.$refs.conditions.conditions).then((rows) => {
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
          'class_time': '',
          'campus': '',
        },
        displayOption: 0,
        number: '',
      },
    };
  },
  watch: {
    conditions: {
      handler() {
        if (this.conditions.number === '0' || this.conditions.number === 0 || parseInt(this.conditions.number) === 0) {
          this.conditions.number = '';
        }
        this.$emit('filter');
      },
      deep: true,
    },

  },
};
