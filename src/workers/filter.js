import registerPromiseWorker from 'promise-worker/register';
import moment from "moment";

function concatRegExp(parts) {
  parts.forEach((part, index) => {
    parts[index] = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp(parts.join('.*'), 'i');
}

registerPromiseWorker(function (message) {
  const isSelected = (data) => {
    return data['classroom_id'] in message.reservedClassroom;
  }
  const isNumberGreater= (data, condition) => {
    let conditionNumber = parseInt(condition);
    if (Number.isInteger(conditionNumber) && conditionNumber > 0) {
      if (data['classroom_id'] in message.allClassroom) {
        let capacity = parseInt(message.allClassroom[`${data['classroom_id']}`]['capacity']);
        return capacity <= conditionNumber;
      }
    }
    if (parseInt(message.allClassroom[`${data['classroom_id']}`]['capacity']) <= 1) {
      return true;
    }
    return ;
  };

  const isOccupied = (data, condition) => {

      // if (moment(condition.date).isAfter('2021-12-28')) {
      //   console.log(condition.date, 'fuck');
      //   if (condition.date !== null && condition.timeslot !== null) {
      //     let week = (condition.date.getDay()+6)%7;
      //     let empty_flag = false;
      //     condition.timeslot.forEach((ts)=> {
      //       let currentUsage = data['usage'][(week+1).toString()+(ts).toString()]
      //       if (currentUsage && currentUsage['courseName'] === '临时') {
      //         if (currentUsage['occupiedDate']) {
      //           if (currentUsage['occupiedDate'].includes(moment(condition.date).format('YYYY-MM-DD'))) {
      //             empty_flag = true;
      //           }
      //         }
      //         // else {
      //         //     empty_flag = false;
      //         // }
      //       }
      //     })
      //     return empty_flag;
      //   }
      // }

        if (condition.date !== null && condition.timeslot !== null) {
          let week = (condition.date.getDay()+6)%7;
          let empty_flag = false;
          condition.timeslot.forEach((ts)=> {
            let currentUsage = data['usage'][(week+1).toString()+(ts).toString()]
            if (currentUsage && currentUsage['courseName'] !== null) {
              if (currentUsage['occupiedDate']) {
                if (currentUsage['occupiedDate'].includes(moment(condition.date).format('YYYY-MM-DD'))) {
                  empty_flag = true;
                }
                if (currentUsage['isCourse']) {
                  empty_flag = true;
                }
              }else {
                  empty_flag = true;
              }
            }
          })
          return empty_flag;
        }
  }

  let rows = [];
  let conditionsRegExp = {};
  for (let condition in message.conditions.search) {
    if (condition in message.conditions.search) {
      conditionsRegExp[condition] = concatRegExp(message.conditions.search[condition].split(/\s+/))
    }
  }

   Object.keys(message.allClassroom).forEach((key) => {
    let row = message.allClassroom[key]
    if (!message.conditions.class_time.timeslot) {
        return;
    }
    if (isNumberGreater(message.allClassroom[key], message.conditions.capacity)) {
      return;
    }
    if (isOccupied(message.allClassroom[key], message.conditions.class_time)) {
        return ;
    }
    for (let condition in conditionsRegExp) {
      if ( condition in conditionsRegExp) {
        if (!conditionsRegExp[condition].test(message.allClassroom[key][condition])) {
          return;
        }
      }
    }

    let newRow = Object.assign({}, row);
    newRow['classroom'] = {
      row: row,
      classroom_id: newRow['classroom_id'],
      capacity: newRow['capacity'],
      building: newRow['building'],
      type: newRow['type'],
    };
    newRow['action'] = {
      row: row,
      isSelected: isSelected(row),
    }
    rows.push(newRow);
  })
  return rows;
});
