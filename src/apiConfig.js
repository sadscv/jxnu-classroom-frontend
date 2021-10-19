export default {
  infoApi: '/api/courses/info',
  extraApi: '/api/courses/extra',
  getDataApi: (hash) => `/api/courses/${hash}.json`,
  flaskInfoApi: '/API/v1.0/info',
  flaskextraApi: '/API/v1.0/extra',
  flaskApi: (c_id) => `/API/v1.0/course/${c_id}`,
  getClassInfoApi: '/API/v1.0/class_info',
  getAllCoursesInfoApi: '/API/v1.0/all_classes'
};
