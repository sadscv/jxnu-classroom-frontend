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
    '$store.state.allClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
    '$store.state.selectedClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
    '$store.state.reservedClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    countdown(delay, toPageOne) {
      this.storageBusy = true;
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.filter(this.$refs.conditions.conditions).then((rows) => {
          this.rows = rows;
          this.storageBusy = false;
          if (toPageOne) {
            if (this.$refs.hasOwnProperty('table')) {
              this.$refs.table.$children[0].sPagination.current = 1;
            } else if (this.$refs.hasOwnProperty('list')) {
              this.$refs.list.paginationCurrent = 1;
            }
          }
        });
      }, delay);
    },
    filter(conditions) {
      return this.promiseWorker.postMessage({
        allClasses: this.$store.state.allCourses,
        reservedClasses: this.$store.state.reservedClasses,
        selectedClasses: this.$store.state.selectedClasses,
        scheduleTableRows: this.$store.getters.scheduleTableRows,
        allClassesExtra: this.$store.state.allClassesExtra,
        classList: this.$store.state.classList,
        conditions,
      });
    },
    reserveClass(data, select, conflicts) {
      if (select && Object.keys(conflicts).length > 0) {
        this.storageBusy = true;
        this.$store.dispatch('reserveClass', data).then(() => {
          this.showConflictsSolvingDialog(data, conflicts);
        });
      } else {
        this.storageBusy = true;
        this.$store.dispatch(select ? 'reserveClassThenSelect' : 'reserveClass', data);
      }
    },
    removeReservedClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('removeReservedClass', data);
    },
    selectClass(data, conflicts) {
      if (Object.keys(conflicts).length > 0) {
        this.showConflictsSolvingDialog(data, conflicts);
      } else {
        this.storageBusy = true;
        this.$store.dispatch('selectClass', data);
      }
    },
    unselectClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('unselectClass', data);
    },
    previewTeacherClasses(teacherId) {
      window.console.log(teacherId);
      if (!this.storageBusy) {
        let condition = {
          search: {
            'course_id': '',
            'course_name': '',
            'class_name':'',
            'credit': '',
            'teacher_id': teacherId,
            'teacher_name': '',
            'class_time': '',
            'campus': '',
          },
          filterConflicts: false,
          displayOption: 0,
          number: '',
        };
        let previewCourses = [];
        this.filter(condition).then(((courses) => {
          this.storageBusy = false;
          courses.forEach((course) => {
            previewCourses.push({
              courseId: course['course_id'],
              courseName: course['course_name'],
              classId: course['teacher_id'],
              teacherName: course['teacher_name'],
              classTime: course['class_time'],
              classList: this.$store.state.classList,
            })
          })
        }));
        this.$store.commit('PREVIEW_CLASS', previewCourses)
      }
    },
    cancelPreviewTeacherClasses(row) {
      if (this.$store.state.previewClass !== [] && row) {
        this.$store.commit('PREVIEW_CLASS', null);
      }
    },
    getLimitationColor(limitation) {
      switch (limitation) {
        case '禁止选课':
          return 'red';
        case '禁止退课':
          return 'blue';
        case '限制人数':
          return 'orange';
        default:
          return null;
      }
    },
  },
};

export const LookupConditionsMixin = {
  data() {
    return {
      conditions: {
        search: {
          'college': '',
          'course_id': '',
          'course_name': '',
          'class_name':'',
          'credit': '',
          'teacher_id': '',
          'teacher_name': '',
          'class_time': '',
          'campus': '',
        },
        filterConflicts: false,
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
