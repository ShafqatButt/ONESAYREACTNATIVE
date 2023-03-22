import moment from 'moment';

const weekDays = ['fri', 'mon', 'sat', 'sun', 'thu', 'tue', 'wed'];

export const getMissingDays = data => {
  let missingDays = [];

  weekDays.forEach(day => {
    if (!Object.keys(data).includes(day)) {
      missingDays.push(day);
    }
  });

  return missingDays;
};

// const busy = [
//   {
//     end: '2023-02-13T11:00:00.000Z',
//     start: '2023-02-13T10:00:00.000Z',
//     title: 'Video Conference between Dhruman Bhadeshiya and Amjad Islam',
//   },
// ];

/**
 * const startDate = new Date().addDays(1);
 * const endDate = new Date(new Date().getTime() + TWO_MONTHS_PLUS_WEEK);
 *
 * let dateArray = getAvailableDates(startDate, endDate);
 *
 * let availableDates = [];
 * for (let i = 0; i < dateArray.length; i++) {
 *   availableDates.push(
 *     dateArray[i].toISOString().split('T')[0] + 'T07:00:00.000Z',
 *   );
 * }
 *
 * console.log('availableDates ==> ', availableDates);
 * @param startDate
 * @param stopDate
 * @param daysToSkip
 * @returns {any[]}
 */
export function getAvailableDates(startDate, stopDate, daysToDisable = []) {
  // TODO: Need to add code to handle daysToSkip...
  let dateArray = new Array();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate);
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}
export const getMergedStartEndTimes = data => {
  const times = {};

  //console.log('data', data);
  Object.keys(data).forEach(key => {
    if (data[key].length == 0) return;
    const tempOne = data[key][0];
    // console.log('data[key]', data[key]);
    const hour = parseInt(tempOne.startTime.split(':')[0], 10);
    const min = parseInt(tempOne.startTime.split(':')[1], 10);
    const sumValue = hour + min;
    let lastStartTime = {
      timeString: tempOne.startTime,
      value: sumValue,
    };

    const eHour = parseInt(tempOne.endTime.split(':')[0], 10);
    const eMin = parseInt(tempOne.endTime.split(':')[1], 10);
    const eSumValue = eHour + eMin;
    let lastEndTime = {
      timeString: tempOne.endTime,
      value: eSumValue,
    };

    data[key].forEach(values => {
      const sTime = values.startTime;
      const hour = parseInt(values.startTime.split(':')[0], 10);
      const min = parseInt(values.startTime.split(':')[1], 10);
      const sumValue = hour + min;
      if (sumValue < lastStartTime.value) {
        lastStartTime = {
          timeString: sTime,
          value: sumValue,
        };
      }

      const eTime = values.startTime;
      const eHour = parseInt(values.endTime.split(':')[0], 10);
      const eMin = parseInt(values.endTime.split(':')[1], 10);
      const eSumValue = eHour + eMin;
      if (eSumValue > lastEndTime.value) {
        lastEndTime = {
          timeString: eTime,
          value: eSumValue,
        };
      }
    });

    times[key] = {
      startTime: lastStartTime.timeString,
      endTime: lastEndTime.timeString,
    };
  });

  return times;
};

const getTimeStops = (start, end, duration = 30) => {
  // let startTime = moment(start, 'HH:mm');
  // let endTime = moment(end, 'HH:mm');
  let startTime = moment(start);
  let endTime = moment(end);

  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }

  let timeStops = [];

  while (startTime <= endTime) {
    // timeStops.push(new moment(startTime).format('HH:mm'));
    timeStops.push(new moment(startTime).toISOString());
    startTime.add(duration, 'minutes');
  }
  return timeStops;
};

/**
 * const duration = 60;
 * // const startTime = '00:00';
 * // const endTime = '23:00';
 * const startTime = '2023-01-14T00:00:00.000Z';
 * const endTime = '2023-01-14T23:00:00.000Z';
 *
 * const timeSlots = getAvailableTimeSlots(startTime, endTime, duration);
 *
 * console.log('timeStops =>', timeSlots);
 * @param startTime
 * @param endTime
 * @param duration
 * @returns {[]}
 */
export const getAvailableTimeSlots = (startTime, endTime, duration = 60) => {
  const dayTimeSlots = [];
  // const _startTime = moment(startTime, 'HH:mm')
  //   .add(duration, 'minute').format('HH:mm');
  // const _endTime = moment(endTime, 'HH:mm')
  //   .add(duration, 'minute').format('HH:mm');
  const _startTime = moment(startTime).add(duration, 'minute').toISOString();
  const _endTime = moment(endTime).add(duration, 'minute').toISOString();

  let startTimes = getTimeStops(startTime, endTime, duration);
  let endTimes = getTimeStops(_startTime, _endTime, duration);

  startTimes.forEach((sTime, index) =>
    dayTimeSlots.push({
      // timeText: moment(sTime, 'HH:mm').format('HH:mma'),
      // endTime: endTimes[index],
      // startTime: moment(sTime, 'HH:mm').toISOString(),
      // endTime: moment(endTimes[index], 'HH:mm').toISOString(),
      timeText: moment(startTimes[index]).format('hh:mma'),
      // endTime: endTimes[index],
      startTime: sTime,
      endTime: endTimes[index],
    }),
  );

  return dayTimeSlots;
};

export const generateAvailableTimeSlots = (
  busy,
  timeSlots,
  selectedDate,
  availability,
) => {
  // console.log('busybusybusy', busy);
  const selectedDay = moment(selectedDate).format('ddd').toLowerCase();
  const dayToEnable = availability[selectedDay];
  let enabledTimeSlots = [];

  dayToEnable.forEach(schedule => {
    const sTimes = schedule.startTime.split(':');
    const eTimes = schedule.endTime.split(':');
    // const _startTime = moment(`${sTimes[0]}:${sTimes[1]}`, 'HH:mm');
    // const _endTime = moment(`${eTimes[0]}:${eTimes[1]}`, 'HH:mm');
    const _start_time = moment(
      `${selectedDate.split('T')[0]}T${sTimes[0]}:${sTimes[1]}:00.000Z`,
    );
    const _end_time = moment(
      `${selectedDate.split('T')[0]}T${eTimes[0]}:${eTimes[1]}:00.000Z`,
    );

    // const startTime = moment(
    //   `${selectedDate.split('T')[0]}T${_startTime.toISOString().split('T')[1]}`,
    // );
    // const endTime = moment(
    //   `${selectedDate.split('T')[0]}T${_endTime.toISOString().split('T')[1]}`,
    // );

    const startTime = _start_time;
    const endTime = _end_time; //

    timeSlots.forEach((slot, index) => {
      const slotStart = moment(slot.startTime);
      const slotEnd = moment(slot.endTime);

      // TODO: Need to handle equal case for start time & end time...
      if (
        (slotStart.isSame(startTime) ||
          slotStart.isBetween(
            startTime,
            endTime,
            'YYYY-MM-DDThh:mm:ss.sssZ',
          )) &&
        (slotEnd.isSame(endTime) ||
          slotEnd.isBetween(startTime, endTime, 'YYYY-MM-DDThh:mm:ss.sssZ'))
      ) {
        // if (slotStart.isAfter(startTime) && slotEnd.isBefore(endTime)) {
        timeSlots[index].enabled = true;
      }
    });
  });

  //console.log('busy', busy);

  let busySlotsForSelectedDays = [];
  busy.forEach(val => {
    if (val.start.split('T')[0] === selectedDate.split('T')[0]) {
      busySlotsForSelectedDays.push(val);
    }
  });

  timeSlots.forEach((timeSlot, index) => {
    const slotStart = moment(timeSlot.startTime);
    const slotEnd = moment(timeSlot.endTime);
    busySlotsForSelectedDays.forEach(busySlot => {
      const busyStart = moment(busySlot.start);
      const busyEnd = moment(busySlot.end);
      console.log('busyStart', busyStart);

      if (
        slotStart.isSame(busyStart) ||
        (slotStart.isBetween(busyStart, busyEnd, 'YYYY-MM-DDThh:mm:ss.sssZ') &&
          (slotEnd.isSame(busyEnd) ||
            slotEnd.isBetween(busyStart, busyEnd, 'YYYY-MM-DDThh:mm:ss.sssZ')))
      ) {
        timeSlots[index].enabled = false;
      }
    });
  });

  return timeSlots;
};
