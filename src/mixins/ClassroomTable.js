import {isMacLike} from '../utils';

export const ClassroomTableMixin = {
  data() {
    return {
      classPeriods: [
        ['8:00', '9:30'],
        ['9:40', '10:20'],
        ['10:30', '11:10'],
        ['11:20', '12:00'],
        ['14:00', '15:30'],
        ['15:40', '17:10'],
        ['19:00', '21:20'],
        // ['16:00', '16:45'],
        // ['16:55', '17:40'],
        // ['18:00', '18:45'],
        // ['18:55', '19:40'],
        // ['19:50', '20:35'],
        // ['19:50', '20:35'],
      ],
      venueMode: false,
      capturing: false,
      colorSeedShortcut: isMacLike ? '⇧⌘K' : 'Ctrl+Shift+K',
    };
  },
  computed: {
    rows() {
      return JSON.parse(JSON.stringify(this.$store.getters.ClassroomTableRows));
      // [6, 5, 4, 3, 2, 1, 0].forEach((j) => {
      //     [6, 5, 4, 3, 2, 1, 0].forEach((i) => {
      //       rows[i][j] = null;
      //   });
      // });
    }

  },
  methods: {
  },
};

export const ClassCardMixin = {
  computed: {
    style() {
      return {
        color: 'rgba(255, 255, 255, 0.95)',
      };
    },
  },
  methods: {
  }
};
