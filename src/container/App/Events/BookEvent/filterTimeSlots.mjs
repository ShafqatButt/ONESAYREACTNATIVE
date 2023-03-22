import moment from 'moment';

const availabilityResponse = {
  availability: {
    sun: [
      {
        startTime: '10:00:00',
        endTime: '16:00:00',
      },
      {
        startTime: '04:00:17',
        endTime: '12:00:17',
      },
      {
        startTime: '04:00:25',
        endTime: '12:00:25',
      },
      {
        startTime: '04:00:09',
        endTime: '12:00:09',
      },
      {
        startTime: '14:00:04',
        endTime: '15:00:04',
      },
      {
        startTime: '04:00:55',
        endTime: '13:00:55',
      },
    ],
    mon: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:46',
        endTime: '12:00:46',
      },
      {
        startTime: '04:00:11',
        endTime: '12:00:11',
      },
    ],
    tue: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:49',
        endTime: '12:00:49',
      },
      {
        startTime: '04:00:56',
        endTime: '12:00:56',
      },
    ],
    wed: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:49',
        endTime: '12:00:49',
      },
    ],
    thu: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:50',
        endTime: '12:00:50',
      },
    ],
    fri: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:50',
        endTime: '12:00:50',
      },
    ],
    sat: [
      {
        startTime: '09:00:00',
        endTime: '17:00:00',
      },
      {
        startTime: '04:00:51',
        endTime: '12:00:51',
      },
    ],
  },
};
const timeSlots = [
  {
    timeText: '05:00am',
    startTime: '2023-01-17T00:00:00.000Z',
    endTime: '2023-01-17T01:00:00.000Z',
  },
  {
    timeText: '06:00am',
    startTime: '2023-01-17T01:00:00.000Z',
    endTime: '2023-01-17T02:00:00.000Z',
  },
  {
    timeText: '07:00am',
    startTime: '2023-01-17T02:00:00.000Z',
    endTime: '2023-01-17T03:00:00.000Z',
  },
  {
    timeText: '08:00am',
    startTime: '2023-01-17T03:00:00.000Z',
    endTime: '2023-01-17T04:00:00.000Z',
  },
  {
    timeText: '09:00am',
    startTime: '2023-01-17T04:00:00.000Z',
    endTime: '2023-01-17T05:00:00.000Z',
  },
  {
    timeText: '10:00am',
    startTime: '2023-01-17T05:00:00.000Z',
    endTime: '2023-01-17T06:00:00.000Z',
  },
  {
    timeText: '11:00am',
    startTime: '2023-01-17T06:00:00.000Z',
    endTime: '2023-01-17T07:00:00.000Z',
  },
  {
    timeText: '12:00pm',
    startTime: '2023-01-17T07:00:00.000Z',
    endTime: '2023-01-17T08:00:00.000Z',
  },
  {
    timeText: '13:00pm',
    startTime: '2023-01-17T08:00:00.000Z',
    endTime: '2023-01-17T09:00:00.000Z',
  },
  {
    timeText: '14:00pm',
    startTime: '2023-01-17T09:00:00.000Z',
    endTime: '2023-01-17T10:00:00.000Z',
  },
  {
    timeText: '15:00pm',
    startTime: '2023-01-17T10:00:00.000Z',
    endTime: '2023-01-17T11:00:00.000Z',
  },
  {
    timeText: '16:00pm',
    startTime: '2023-01-17T11:00:00.000Z',
    endTime: '2023-01-17T12:00:00.000Z',
  },
  {
    timeText: '17:00pm',
    startTime: '2023-01-17T12:00:00.000Z',
    endTime: '2023-01-17T13:00:00.000Z',
  },
  {
    timeText: '18:00pm',
    startTime: '2023-01-17T13:00:00.000Z',
    endTime: '2023-01-17T14:00:00.000Z',
  },
  {
    timeText: '19:00pm',
    startTime: '2023-01-17T14:00:00.000Z',
    endTime: '2023-01-17T15:00:00.000Z',
  },
  {
    timeText: '20:00pm',
    startTime: '2023-01-17T15:00:00.000Z',
    endTime: '2023-01-17T16:00:00.000Z',
  },
  {
    timeText: '21:00pm',
    startTime: '2023-01-17T16:00:00.000Z',
    endTime: '2023-01-17T17:00:00.000Z',
  },
  {
    timeText: '22:00pm',
    startTime: '2023-01-17T17:00:00.000Z',
    endTime: '2023-01-17T18:00:00.000Z',
  },
  {
    timeText: '23:00pm',
    startTime: '2023-01-17T18:00:00.000Z',
    endTime: '2023-01-17T19:00:00.000Z',
  },
  {
    timeText: '00:00am',
    startTime: '2023-01-17T19:00:00.000Z',
    endTime: '2023-01-17T20:00:00.000Z',
  },
  {
    timeText: '01:00am',
    startTime: '2023-01-17T20:00:00.000Z',
    endTime: '2023-01-17T21:00:00.000Z',
  },
  {
    timeText: '02:00am',
    startTime: '2023-01-17T21:00:00.000Z',
    endTime: '2023-01-17T22:00:00.000Z',
  },
  {
    timeText: '03:00am',
    startTime: '2023-01-17T22:00:00.000Z',
    endTime: '2023-01-17T23:00:00.000Z',
  },
  {
    timeText: '04:00am',
    startTime: '2023-01-17T23:00:00.000Z',
    endTime: '2023-01-18T00:00:00.000Z',
  },
];
const busy = [
  {
    end: '2023-02-13T11:00:30.000Z',
    start: '2023-03-14T10:00:00.000Z',
    title: 'Video Conference between Dhruman Bhadeshiya and Amjad Islam',
  },
  {
    end: '2023-01-15T21:30:00.000Z',
    start: '2023-01-15T20:30:00.000Z',
    title: 'One to One between Dhruman Bhadeshiya and Dhruman Bhadeshiya',
  },
  {
    end: '2023-01-18T08:00:30.000Z',
    start: '2023-01-18T07:00:00.000Z',
    title: 'Video Conference between Dhruman Bhadeshiya and Amjad Islam',
  },
  {
    end: '2023-03-14T11:00:30.000Z',
    start: '2023-03-14T10:00:00.000Z',
    title: 'Video Conference between Dhruman Bhadeshiya and Amjad Islam',
  },
  {
    end: '2023-01-17T06:00:30.000Z',
    start: '2023-01-17T05:00:00.000Z',
    title: 'One to One between Dhruman Bhadeshiya and Dev user',
  },
  {
    end: '2023-03-10T10:00:30.000Z',
    start: '2023-03-10T09:00:00.000Z',
    title: 'One to One between Dhruman Bhadeshiya and Dev user',
  },
  {
    end: '2023-03-15T11:00:30.000Z',
    start: '2023-03-15T10:00:00.000Z',
    title: 'One to One between Dhruman Bhadeshiya and Dev user',
  },
  {
    end: '2023-01-17T04:45:46.000Z',
    start: '2023-01-17T04:00:46.000Z',
    title: 'Event between Dhruman Bhadeshiya and jones david',
  },
  {
    end: '2023-01-18T09:46:00.000Z',
    start: '2023-01-18T09:46:00.000Z',
    title: 'Event between Dhruman Bhadeshiya and Anya',
  },
  {
    end: '2023-01-19T08:00:30.000Z',
    start: '2023-01-19T07:00:00.000Z',
    title: 'Video Conference between Dhruman Bhadeshiya and Dev user',
  },
  {
    end: '2023-01-18T08:09:21.000Z',
    start: '2023-01-18T08:09:21.000Z',
    title: 'One to One between Dhruman Bhadeshiya and Amjad Islam',
  },
  {
    end: '2023-01-17T06:55:01.000Z',
    start: '2023-01-17T06:55:01.000Z',
    title: 'Event between Dhruman Bhadeshiya and jones david',
  },
  {
    end: '2023-01-18T09:46:00.000Z',
    start: '2023-01-18T09:46:00.000Z',
    title: 'Event between Dhruman Bhadeshiya and jones david',
  },
  {
    end: '2023-01-15T21:30:00.000Z',
    start: '2023-01-15T20:30:00.000Z',
  },
  {
    end: '2023-01-17T04:45:46.000Z',
    start: '2023-01-17T04:00:46.000Z',
  },
  {
    end: '2023-01-17T06:00:30.000Z',
    start: '2023-01-17T05:00:00.000Z',
  },
  {
    end: '2023-01-17T06:55:01.000Z',
    start: '2023-01-17T06:55:01.000Z',
  },
  {
    end: '2023-01-18T08:00:30.000Z',
    start: '2023-01-18T07:00:00.000Z',
  },
  {
    end: '2023-01-18T08:09:21.000Z',
    start: '2023-01-18T08:09:21.000Z',
  },
  {
    end: '2023-01-18T09:46:00.000Z',
    start: '2023-01-18T09:46:00.000Z',
  },
  {
    end: '2023-01-19T08:00:30.000Z',
    start: '2023-01-19T07:00:00.000Z',
  },
  {
    end: '2023-03-10T10:00:30.000Z',
    start: '2023-03-10T09:00:00.000Z',
  },
  {
    end: '2023-03-14T09:00:30.000Z',
    start: '2023-03-14T08:00:00.000Z',
  },
  {
    end: '2023-03-14T11:00:30.000Z',
    start: '2023-03-14T10:00:00.000Z',
  },
  {
    end: '2023-03-15T11:00:30.000Z',
    start: '2023-03-15T10:00:00.000Z',
  },
];

const selectedDate = '2023-01-17T00:00:00.000Z';
const selectedDay = 'tue';

const dayToEnable = availabilityResponse?.availability[selectedDay];
let enabledTimeSlots = [];

dayToEnable.forEach(schedule => {
  // console.log('schedule ==> ', JSON.stringify(schedule));
  const sTimes = schedule.startTime.split(':');
  const eTimes = schedule.endTime.split(':');

  const _start_time = moment(
    `${selectedDate.split('T')[0]}T${sTimes[0]}:${sTimes[1]}:00.000Z`,
  );
  const _end_time = moment(
    `${selectedDate.split('T')[0]}T${eTimes[0]}:${eTimes[1]}:00.000Z`,
  );

  // const _startTime = _start_time; // moment(`${sTimes[0]}:${sTimes[1]}`, 'HH:mm');
  // const _endTime = _end_time; // moment(`${eTimes[0]}:${eTimes[1]}`, 'HH:mm');

  const startTime = _start_time; // moment(`${selectedDate.split('T')[0]}T${_startTime.toISOString().split('T')[1]}`);
  const endTime = _end_time; // moment(`${selectedDate.split('T')[0]}T${_endTime.toISOString().split('T')[1]}`);

  // console.log('dayToEnable (startTime) ==> ', startTime.format('HH:mm'), startTime.toISOString());

  timeSlots.forEach((slot, index) => {
    const slotStart = moment(slot.startTime);
    const slotEnd = moment(slot.endTime);
    // console.log('.....................');
    // console.log('slotStart.isAfter(startTime) => ', slotStart.isAfter(startTime));
    // console.log('slotEnd.isBefore(endTime) => ', slotEnd.isBefore(endTime));
    // console.log('slotStart ==> ', slotStart.toISOString(), ', startTime => ', startTime.toISOString())
    // console.log('slotEnd ==> ', slotEnd.toISOString(), ', endTime => ', endTime.toISOString())
    // console.log('.....................');
    if (slotStart.isAfter(startTime) && slotEnd.isBefore(endTime)) {
      timeSlots[index]['enabled'] = true;
    }
  });
});

enabledTimeSlots = timeSlots.filter(s => s.enabled);
console.log('enabledTimeSlots ==> ', enabledTimeSlots);

let busySlotsForSelectedDays = [];
Object.values(busy).forEach(val => {
  if (val.start.split('T')[0] === selectedDate.split('T')[0]) {
    busySlotsForSelectedDays.push(val);
  }
});

console.log('busySlotsForSelectedDays ==> ', busySlotsForSelectedDays);

let finalTimeSlots = [];

enabledTimeSlots.forEach((timeSlot, index) => {
  const slotStart = moment(timeSlot.startTime);
  const slotEnd = moment(timeSlot.endTime);
  // console.log("*slotStart* ==> ", slotStart.toISOString());
  busySlotsForSelectedDays.forEach(busySlot => {
    const busyStart = moment(busySlot.start);
    const busyEnd = moment(busySlot.end);
    if (
      slotStart.isBetween(busyStart, busyEnd) ||
      slotEnd.isBetween(busyStart, busyEnd)
    ) {
      enabledTimeSlots[index].enabled = false;
    }
  });
});

finalTimeSlots = enabledTimeSlots.filter(s => s.enabled);
console.log('finalTimeSlots ==> ', finalTimeSlots);

// console.log('finalTimeSlots ==> ', finalTimeSlots);

// const generateAvailableTimeSlots = (selectedDate) => {
//   const selectedDay = moment(selectedDate).format('ddd').toLowerCase();
//   const dayToEnable = availabilityResponse?.availability[selectedDay];
//   let enabledTimeSlots = [];
//
//   dayToEnable.forEach(schedule => {
//     const sTimes = schedule.startTime.split(':')
//     const eTimes = schedule.endTime.split(':')
//     const _startTime = moment(`${sTimes[0]}:${sTimes[1]}`, 'HH:mm');
//     const _endTime = moment(`${eTimes[0]}:${eTimes[1]}`, 'HH:mm');
//
//     const startTime = moment(`${selectedDate.split('T')[0]}T${_startTime.toISOString().split('T')[1]}`);
//     const endTime = moment(`${selectedDate.split('T')[0]}T${_endTime.toISOString().split('T')[1]}`);
//
//     timeSlots.forEach(slot => {
//       const slotStart = moment(slot.startTime);
//       const slotEnd = moment(slot.endTime);
//       if (slotStart.isAfter(startTime) && slotEnd.isBefore(endTime)) {
//         enabledTimeSlots.push(slot);
//       }
//     })
//   });
//
//   let busySlotsForSelectedDays = [];
//   Object.values(busy).forEach(val => {
//     if (val.start.split('T')[0] === selectedDate.split('T')[0]) {
//       busySlotsForSelectedDays.push(val);
//     }
//   });
//
//   let finalTimeSlots = [];
//
//   enabledTimeSlots.forEach(timeSlot => {
//     const slotStart = moment(timeSlot.startTime);
//     const slotEnd = moment(timeSlot.endTime);
//     busySlotsForSelectedDays.forEach(busySlot => {
//       const busyStart = moment(busySlot.start);
//       const busyEnd = moment(busySlot.end);
//       if (slotStart.isBefore(busyStart) && slotEnd.isAfter(busyEnd)) {
//         if (!finalTimeSlots.includes(timeSlot)) {
//           finalTimeSlots.push(timeSlot);
//         }
//       }
//     });
//   });
//
//   return finalTimeSlots;
// };
//
// console.log('getAvailableTimeSlots() ===> ', generateAvailableTimeSlots(selectedDate));
