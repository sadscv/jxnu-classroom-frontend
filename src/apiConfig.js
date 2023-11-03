export default {
  extraApi: '/api/courses/extra',
  getDataApi: (hash) => `/api/courses/${hash}.json`,
  getClassroomApi: (params) => `${'/API/v1.0/all_classroom'}?${encodeSearchParames(params)}`,
  infoApi: '/API/v1.0/info',
  getTicketApi: (ticketId) => `/API/v1.0/ticket/${ticketId}.pdf`,
  getTeacherInfoApi: (teacherId) => `/API/v1.0/teacher_info/${teacherId}`,
};


export function encodeSearchParames(obj) {
  const params = []
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'undefined') {
      value = ''
    }
    params.push([key, encodeURIComponent(value)].join('='))
  })

  console.log(params.join('&'))
  return params.join('&')
}