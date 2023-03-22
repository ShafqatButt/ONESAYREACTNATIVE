// noinspection ES6CheckImport

import React, {useState, useRef} from 'react';
import {Pressable, Text as RnText} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AvailabilityText, BorderContainer, Text} from '../style';
import {Spacer} from '../../../../../res/spacer';

export const TimePicker = props => {
  const {selectedTime, durationText, onTimeSelected, timeSlots} = props;
  const [selected, setSelected] = useState(selectedTime?.timeText);
  //console.log('timeSlots', timeSlots);

  return (
    <>
      <Spacer space={wp(2)} />
      <Text>Select a Time</Text>
      <Spacer space={hp(1)} />
      <RnText style={{paddingHorizontal: wp('6%'), color: 'black'}}>
        Duration: {durationText}
      </RnText>
      <Spacer space={hp(1)} />
      {/*<View style={styles.rowContainerStyle}>
        <RegularText>Start Time</RegularText>
        <TouchableOpacity
          onPress={() => {
            refCurrentMinDate.current = new Date();
            setOpenTimePicker(!openTimePicker);
            setSelection(1);
          }}
          style={styles.chipContainerStyle}>
          <Text style={[{letterSpacing: wp(1)}]}>{startTime}</Text>
        </TouchableOpacity>
      </View>
      <BorderContainer />
      <View style={styles.rowContainerStyle}>
        <RegularText>End Time</RegularText>
        <TouchableOpacity
          onPress={() => {
            refCurrentMinDate.current = new Date();
            setOpenTimePicker(!openTimePicker);
            setSelection(2);
          }}
          style={styles.chipContainerStyle}>
          <Text style={[{letterSpacing: wp(1)}]}>{endTime}</Text>
        </TouchableOpacity>
      </View>*/}
      <BorderContainer />
      {timeSlots
        ?.filter(slot => slot.enabled)
        ?.map(data => (
          <Pressable
            onPress={() => {
              console.log('data ===> ', JSON.stringify(data));
              onTimeSelected(data);
              setSelected(() => data.timeText);
            }}>
            <Spacer space={hp(0.5)} />
            <AvailabilityText isSelected={data?.timeText === selected}>
              {data?.timeText}
            </AvailabilityText>
          </Pressable>
        ))}
    </>
  );
};
