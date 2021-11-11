export const CourseColorMixin = {
  computed: {
    style() {
      let colors = [
        '#D32F2F',
        '#7B1FA2',
        '#303F9F',
        '#1976D2',
        '#689F38',
        '#FBC02D',
        '#FFA000',
        '#F57C00',
        '#E64A19',
        '#5D4037',
        ];
      if (this.$store.state.reservedClassroom(this.classroom_id)) {

        return {
          background: this.$store.state.reservedClassroom[this.classroom_id].themeColor,
        };
      } else {
        return {
          background: colors[0],
        };
      }
    },
  },
};