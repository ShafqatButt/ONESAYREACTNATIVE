import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {options, options_modal} from './utils';

import TripsList from '../../container/App/Trips/TripsList';
import TripDetails from '../../container/App/Trips/TripDetails';

const Stack = createNativeStackNavigator();

const TripsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'TripsList'}>
      <Stack.Screen
        options={options}
        name={'TripsList'}
        component={TripsList}
      />
      <Stack.Screen
        options={options}
        name={'TripDetails'}
        component={TripDetails}
      />
    </Stack.Navigator>
  );
};

export default TripsNavigator;
