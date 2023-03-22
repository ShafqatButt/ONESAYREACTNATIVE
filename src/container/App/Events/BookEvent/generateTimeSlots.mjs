import moment from 'moment';

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

const getAvailableTimeSlots = (startTime, endTime, duration = 60) => {
  const dayTimeSlots = [];
// const _startTime = moment(startTime, 'HH:mm')
//   .add(duration, 'minute').format('HH:mm');
// const _endTime = moment(endTime, 'HH:mm')
//   .add(duration, 'minute').format('HH:mm');
  const _startTime = moment(startTime)
    .add(duration, 'minute').toISOString();
  const _endTime = moment(endTime)
    .add(duration, 'minute').toISOString();

  let startTimes = getTimeStops(startTime, endTime, duration);
  let endTimes = getTimeStops(_startTime, _endTime, duration);

  startTimes.forEach((sTime, index) =>
    dayTimeSlots.push({
      // timeText: moment(sTime, 'HH:mm').format('HH:mma'),
      // endTime: endTimes[index],
      // startTime: moment(sTime, 'HH:mm').toISOString(),
      // endTime: moment(endTimes[index], 'HH:mm').toISOString(),
      timeText: moment(startTimes[index]).format('HH:mma'),
      // endTime: endTimes[index],
      startTime: sTime,
      endTime: endTimes[index],
    }),
  );

  return dayTimeSlots;
}

const duration = 60;
// const startTime = '00:00';
// const endTime = '23:00';
const startTime = '2023-01-17T00:00:00.000Z';
const endTime = '2023-01-17T23:00:00.000Z';

const timeSlots = getAvailableTimeSlots(startTime, endTime, duration);

console.log(
  'timeStops =>',
  JSON.stringify(timeSlots),
);
