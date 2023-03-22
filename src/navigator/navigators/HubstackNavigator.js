import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductCategories from '../../container/App/Hub/ProductCategories';
import {options, options_modal} from './utils';
import VendorSignup from '../../container/App/Hub/VendorSignup';
import AddCategory from '../../container/App/Hub/AddCategory';
import ProductList from '../../container/App/Hub/ProductList';
import AddProducts from '../../container/App/Hub/AddProducts';
import {Platform} from 'react-native';
import MembershipScreen from '../../container/App/MembershipScreen';
import StripePaymentScreen from '../../container/App/StripePaymentScreen';
import ProfileNavigator from './ProfileNavigator';
import BookedEvents from '../../container/App/Events/BookedEvents';
import EventDetails from '../../container/App/Events/EventDetails';
import Account from '../../container/App/Account';
import Notifications from '../../container/App/Home/Notifications';
import EventAvailability from '../../container/App/Events/EventAvailability';
import TimeSlotPicker from '../../container/App/Events/TimeSlotPicker';
import CreateEvent from '../../container/App/Events/CreateEvent';

const Stack = createNativeStackNavigator();

const HubstackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'BookedEvents'}>
      {/* <Stack.Navigator initialRouteName={'ProductCategories'}> */}
      <Stack.Screen
        options={options}
        name={'BookedEvents'}
        component={BookedEvents}
        initialParams={{topTabIndex: 0}}
      />
      <Stack.Screen
        name={'CreateEvent'}
        options={options_modal}
        component={CreateEvent}
      />
      <Stack.Screen
        options={options_modal}
        name={'EventDetails'}
        component={EventDetails}
      />
      <Stack.Screen name={'Account'} component={Account} options={options} />
      <Stack.Screen
        options={options}
        name={'Notifications'}
        component={Notifications}
      />
      <Stack.Screen
        options={options}
        name={'EventAvailability'}
        component={EventAvailability}
      />
      <Stack.Screen
        options={options_modal}
        name={'TimeSlotPicker'}
        component={TimeSlotPicker}
      />
      <Stack.Screen
        name={'ProductCategories'}
        options={options}
        component={ProductCategories}
      />
      <Stack.Screen
        name={'VendorSignup'}
        options={options}
        component={VendorSignup}
      />
      <Stack.Screen
        name={'AddCategory'}
        options={options}
        component={AddCategory}
      />
      <Stack.Screen
        name={'AddProducts'}
        options={options}
        component={AddProducts}
      />
      <Stack.Screen
        name={'ProductList'}
        options={options}
        component={ProductList}
      />

      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: Platform.OS !== 'android',
        }}>
        <Stack.Screen name={'Membership'} component={MembershipScreen} />
        <Stack.Screen
          name={'StripePaymentScreen'}
          component={StripePaymentScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default HubstackNavigator;
