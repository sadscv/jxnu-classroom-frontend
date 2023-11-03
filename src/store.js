import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Storage from './storage';


Vue.use(Vuex);
import apiConfig from './apiConfig';
import moment from "moment";

export default new Vuex.Store({
  state: {
    loaded: true,
    isAdmin: false,
    trimester: null, // 持久化
    disabledDate: null,
    backend: null, // 持久化
    showIntroductionNotification: true,
    allClassrooms : {},
    allTeachers: {},
    allColleges: {},
    usedClassrooms : {},
    appliedClassrooms : {},
    allClassroomHash: null,
    allInfosExtra: null,
    allInfosExtraUpdateTime: null,
    reservedClassroom: {}, // 持久化
    currentBuilding: '惟义楼',
    currentTeacher : {},
    lastUpdateTime: null,
    beginDate: null,
    endDate: null
  },
  getters: {
    ClassroomTableRows(state) {
      // 课程表格
      let rows = [];
      rows = state.usedClassrooms;
      // 将usage 从[1,2,3,4,5...,49]改为{1:1,2:2,3:3,....,49:49}
      for (let row in rows) {
        let tmp_usage = {}
        let usage = rows[row]['usage'];
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
            // console.log(usage[i*7+j]);
            if (usage[i*7+j]) {
              if (usage[i*7+j].includes('tmp')) {
                tmp_usage[(i+1).toString()+(j+1).toString()] = {
                  'courseName': ' ',
                }
              }
              else {
              tmp_usage[(i+1).toString()+(j+1).toString()] = {
                  'courseName': '课程',
                }
              }
            }else {
              tmp_usage[(i+1).toString()+(j+1).toString()] = {
                'courseName': usage[i*7+j],
              }
            }
          }
        }
        rows[row]['usage'] = tmp_usage;
      }
      for (let classroomId in state.appliedClassrooms) {
        for (let date in state.appliedClassrooms[classroomId]) {
          let week = moment(date).isoWeekday()
          let applyInfo = state.appliedClassrooms[classroomId][date]
          for (let tsKey in applyInfo){
            let occupiedDate = [moment(date).format('YYYY-MM-DD')]
            if (classroomId in rows) {
              if (
                  'usage' in rows[classroomId] &&
                  rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]] &&
                  'occupiedDate' in rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]]
              ) {
                occupiedDate += rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]]['occupiedDate']
              }
              if (rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]]) {
                rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]] = {
                  'courseName': '临时',
                  'occupiedDate': occupiedDate,
                  'isCourse': 1,
                };
              } else {
                rows[classroomId]['usage'][week.toString() + applyInfo[tsKey]] = {
                  'courseName': '临时',
                  'occupiedDate': occupiedDate,
                };

              }
            }
          }
        }
      }
      // for (let i = 0; i < 7; i++) {
      //   rows.push([null,null,null,null,null,null,null])
      // }
      // for (let classroomId in state.allClassroom) {
      // }
      return rows;
    },
  },
  mutations: {
    LOADED(state, value) {
      state.loaded = value;
    },
    ISADMIN(state, value) {
      state.isAdmin = value;
    },
    TRIMESTER(state, value) {
      state.trimester = value;
    },
    DISABLED_DATE(state, value) {
      state.disabledDate = value;
    },
    BACKEND(state, value) {
      state.backend = value;
    },
    IGNORE_INTRODUCTION_NOTIFICATION(state) {
      state.showIntroductionNotification = false;
    },
    USED_CLASSROOMS(state, value) {
      state.usedClassrooms = value;
    },
    ALL_TEACHERS(state, value) {
      state.allTeachers = value;
    },
    ALL_COLLEGES(state, value) {
      state.allColleges = value;
    },
    APPLIED_CLASSROOMS(state, value) {
      state.appliedClassrooms = value;
    },
    ALL_INFO(state, value) {
      state.usedClassrooms = value;
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
    CURRENT_TEACHER(state, value) {
      state.currentTeacher = value;
    },
    LAST_UPDATE_TIME(state, value) {
      state.lastUpdateTime = value;
    }
  },
  actions: {
    updateAllClassroomInfo(context, params) {
      return new Promise((resolve, reject) => {
        axios.get(apiConfig.getClassroomApi(params)).then((response) => {
            let used_classrooms = response.data['used_classrooms'];
            let applied_classrooms =  {}
            if ('applied_classrooms' in response.data) {
              applied_classrooms = response.data['applied_classrooms'];
            }
            for (let key in used_classrooms) {
              used_classrooms[key]['classroom_id'] = key;
            }
            context.commit('USED_CLASSROOMS', used_classrooms);
            context.commit('APPLIED_CLASSROOMS', applied_classrooms);
            let tasks = []
            tasks.push(Storage.set('usedClassrooms', used_classrooms));
            tasks.push(Storage.set('appliedClassrooms', applied_classrooms));
            tasks.push(Storage.set('currentBuilding', params['building']));
            Promise.all(tasks).then(() => resolve());
        }).catch(() => {
            reject();
        })
      })
    },
    refreshUpdateTime(context, time) {
      context.commit('LAST_UPDATE_TIME', time)
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
          if (response.data['disabled_date'] !== context.state.disabledDate) {
            context.commit('DISABLED_DATE', response.data['disabled_date']);
            tasks.push(Storage.set('disabledDate', response.data['disabled_date']));
          }
          if (response.data['backend'] !== context.state.backend) {
            context.commit('BACKEND', response.data['backend']);
            tasks.push(Storage.set('backend', response.data['backend']));
          }
          if (response.data['all_teachers'] !== context.state.allTeachers) {
            context.commit('ALL_TEACHERS', response.data['all_teachers']);
            tasks.push(Storage.set('allTeachers', response.data['all_teachers']));
          }
          if (response.data['all_colleges'] !== context.state.allTeachers) {
            context.commit('ALL_COLLEGES', response.data['all_colleges']);
            tasks.push(Storage.set('allColleges', response.data['all_colleges']));
          }
          if (response.data['is_admin'] !== context.state.isAdmin) {
            context.commit('ISADMIN', response.data['is_admin']);
            tasks.push(Storage.set('isAdmin', response.data['is_admin']));
          }
          context.commit('LAST_UPDATE_TIME', moment.now())
          Promise.all(tasks).then(()=> {
            resolve('1');
          });
        }).catch(() => {
          reject();
        });
      });
    },
    updateAllInfosExtra(context) {
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
    clearReservedClassroom(context) {
      return new Promise((resolve) => {
        context.commit('RESERVED_CLASSROOM', {});
        Storage.set('reservedClassroom', {}).then(() => {
          resolve();
        })
      })
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


