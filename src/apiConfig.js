export default {
  extraApi: '/api/courses/extra',
  getDataApi: (hash) => `/api/courses/${hash}.json`,
  getClassroomApi: '/API/v1.0/all_classroom',
  infoApi: '/API/v1.0/info',
  getTeacherInfoApi: (teacherId) => `/API/v1.0/teacher_info/${teacherId}`,
};
