import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Storage from './storage';


Vue.use(Vuex);
import apiConfig from './apiConfig';

export default new Vuex.Store({
  state: {
    loaded: true,
    trimester: null, // 持久化
    backend: null, // 持久化
    showIntroductionNotification: true,
    allClassroom : {},
    allClassroomHash: null,
    allInfosExtra: null,
    allInfosExtraUpdateTime: null,
    reservedClassroom: {}, // 持久化
  },
  getters: {
    ClassroomTableRows(state) {
      // 课程表格
      let rows = [];
      rows = state.allClassroom
      // for (let i = 0; i < 7; i++) {
      //   rows.push([null,null,null,null,null,null,null])
      // }
      // for (let classroomId in state.allClassroom) {
          // window.console.log(state.allClassroom[classroomId]['usage'])
      // }
      return rows;
    },
  },
  mutations: {
    LOADED(state, value) {
      state.loaded = value;
    },
    TRIMESTER(state, value) {
      state.trimester = value;
    },
    BACKEND(state, value) {
      state.backend = value;
    },
    IGNORE_INTRODUCTION_NOTIFICATION(state) {
      state.showIntroductionNotification = false;
    },
    ALL_CLASSROOM(state, value) {
      state.allClassroom = value;
    },
    ALL_INFO(state, value) {
      state.allClassroom = value;
    },
    ALL_INFOS_EXTRA(state, value) {
      state.allInfosExtra = value;
    },
    ALL_INFOS_EXTRA_UPDATE_TIME(state, value) {
      state.allInfosExtraUpdateTime = value;
    },
    RESERVED_CLASSROOM(state, value) {
      state.reservedClassroom = value;
    },
  },
  actions: {
    updateAllClassroomInfo(context) {
      return new Promise((resolve, reject) => {
        axios.get(apiConfig.getClassroomApi).then((response) => {
            let classrooms = response.data;
            window.console.log(response.data);
            for (let key in classrooms) {
              classrooms[key]['classroom_id'] = key;
            }
            context.commit('ALL_CLASSROOM', classrooms);
            Storage.set('allClassroom', classrooms).then(() => resolve());
        }).catch(() => {
            reject();
        })
      })
    },
    updateFromNullStorage() {
        return new Promise((resolve => {resolve();}))
    },
    checkUpdateAllInfos(context) {
      return new Promise((resolve, reject) => {
        axios.get(apiConfig.infoApi).then((response) => {
          let tasks = [];
          if (response.data['trimester'] !== context.state.trimester) {
            context.commit('TRIMESTER', response.data['trimester']);
            tasks.push(Storage.set('trimester', response.data['trimester']));
          }

          if (response.data['backend'] !== context.state.backend) {
            context.commit('BACKEND', response.data['backend']);
            tasks.push(Storage.set('backend', response.data['backend']));
          }
          Promise.all(tasks).then(()=> {
            resolve('1');
          });
        }).catch(() => {
          reject();
        });
      });
    },
    updateAllInfoExtra(context) {
      // 从远程更新扩展数据
      return new Promise((resolve, reject) => {
        axios.get(apiConfig.extraApi).then((response) => {
          if (response.data['hash'] === context.state.allClassroomHash) {
            context.commit('ALL_INFOS_EXTRA', response.data['data']);
            context.commit('ALL_INFOS_EXTRA_UPDATE_TIME', response.data['update_time']);
            Promise.all([
              Storage.set('allInfosExtra', response.data['data']),
              Storage.set('allInfosExtraUpdateTime', response.data['update_time']),
            ]).then(() => {
              resolve();
            });
          } else {
            resolve(response.data['hash']);
          }
        }).catch(() => {
          reject();
        });
      });
    },
    reserveClassroom(context, data) {
      // 添加待选教室
      return new Promise((resolve) => {
        let copy = JSON.parse(JSON.stringify(context.state.reservedClassroom));
        if (!(data['classroom_id'] in copy)) {
          copy[data['classroom_id']] = {
            id: data['classroom_id'],
          };
        }
        context.commit('RESERVED_CLASSROOM', copy);
        Storage.set('reservedClassroom', copy).then(() => {
          resolve();
        });
      });
    },
    unselectClassroom(context, data) {
      // 取消选择课程
      return new Promise((resolve) => {
        let copy = JSON.parse(JSON.stringify(context.state.reservedClassroom));
        if (data in copy) {
          delete copy[data];
          context.commit('RESERVED_CLASSROOM', copy);
          Storage.set('reservedClassroom', copy).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
  },
});


