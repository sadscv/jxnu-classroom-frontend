export default {
  extraApi: '/api/courses/extra',
  getDataApi: (hash) => `/api/courses/${hash}.json`,
  getClassroomApi: (building) => `/API/v1.0/all_classroom/${building}`,
  infoApi: '/API/v1.0/info',
  getTicketApi: (ticketId) => `/API/v1.0/ticket/${ticketId}.pdf`,
  getTeacherInfoApi: (teacherId) => `/API/v1.0/teacher_info/${teacherId}`,
};
