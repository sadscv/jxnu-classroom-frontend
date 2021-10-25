import registerPromiseWorker from 'promise-worker/register';

function concatRegExp(parts) {
  parts.forEach((part, index) => {
    parts[index] = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp(parts.join('.*'), 'i');
}

registerPromiseWorker(function (message) {
  const isNumberGreater= (data, condition) => {
    let conditionNumber = parseInt(condition);
    if (Number.isInteger(conditionNumber) && conditionNumber > 0) {
      if (data['classroom_id'] in message.allClassroom) {
        let capacity = parseInt(message.allClassroom[`${data['classroom_id']}`]['capacity']);
        return capacity >= conditionNumber;
      }
    }
    return ;
  };

  const isEmpty = (data, condition) => {
      let usedTime = condition;
      let allTimeslot = data['usage'];
      console.log(usedTime, allTimeslot)
    return ;
  }

  let rows = [];
  let conditionsRegExp = {};
  console.log(message.conditions);
  for (let condition in message.conditions.search) {
    if ( condition in message.conditions.search) {
      conditionsRegExp[condition] = concatRegExp(message.conditions.search[condition].split(/\s+/))
    }
  }

  // for (let key in message.allClassroom) {
   Object.keys(message.allClassroom).forEach((key) => {
    let row = message.allClassroom[key]
    if (isNumberGreater(message.allClassroom[key], message.conditions.capacity))
      return;
    if (isEmpty(message.allClassroom[key], message.conditions.class_time))
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
    };
    rows.push(newRow);
  })
  // message.allClassroom.forEach((row) => {
  //   if (isNumberGreater(row, message.conditions.number)) {
  //     return;
  //   }
  //   for (let condition in conditionsRegExp) {
  //     if (conditionsRegExp.hasOwn(condition)) {
  //       if (!conditionsRegExp[condition].test(row[condition])) {
  //         return;
  //       }
  //     }
  //   }
  //   // 仅一级属性复制,慎用 :sadscv注
  //   let newRow = Object.assign({}, row);
  //   newRow['course'] = {
  //     id: newRow['course_id'],
  //     name: newRow['course_name'],
  //     credit: newRow['credit'],
  //   };
  //   newRow['teacher'] = {
  //     id: newRow['teacher_id'],
  //     name: newRow['teacher_name'],
  //   };
  //   newRow['venue'] = {
  //     key: `${newRow['course_id']}-${newRow['class_id']}`,
  //     campus: newRow['campus'],
  //   };
  //   newRow['number'] = {
  //     key: `${newRow['course_id']}-${newRow['class_id']}`,
  //   };
  //   newRow['classes'] = {
  //     id: newRow['class_id'],
  //     name: newRow['class_name'],
  //     originClass: getClassName(newRow['origin_class_id']),
  //     originClassId: newRow['origin_class_id'],
  //   };
  //   newRow['class_time_info'] = {
  //     row: row,
  //     key: `${newRow['course_id']}-${newRow['class_id']}`,
  //     isSelected: isSelected(row),
  //     canPreview: getPeriods(newRow['class_time']).length > 0,
  //     conflicts: getConflicts(newRow['course_id'], newRow['class_time']),
  //   };
  //   newRow['action'] = {
  //     row: row,
  //     isReserved: isReserved(row),
  //     isSelected: newRow['class_time_info'].isSelected,
  //     conflicts: newRow['class_time_info'].conflicts,
  //   };
  //   newRow['key'] = `${newRow['course_id']}-${newRow['class_id']}`;
  //   if ((!message.conditions.filterConflicts || Object.keys(newRow['class_time_info'].conflicts).length === 0)
  //     && (message.conditions.displayOption !== 1 || !newRow['action'].isReserved)
  //     && (message.conditions.displayOption !== 2 || newRow['action'].isReserved)) {
  //     rows.push(newRow);
  //   }
  // });
  return rows;
});
