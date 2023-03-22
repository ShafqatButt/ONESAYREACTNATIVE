import React from 'react';
import UnderDevelopmentScreen from '../../container/App/Account/UnderDevelopmentScreen';
import WalletActivityScreen from '../../container/App/Account/WalletActivityScreen';
import AccountVerification from '../../container/App/Account/AccountVerification';
import ProfileEventTypes from '../../container/App/Events/ProfileEventTypes';
import EventAvailability from '../../container/App/Events/EventAvailability';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StripePaymentScreen from '../../container/App/StripePaymentScreen';
import TimezonePicker from '../../container/App/Events/TimezonePicker';
import TimeSlotPicker from '../../container/App/Events/TimeSlotPicker';
import EventSettings from '../../container/App/Events/EventSettings';
import WalletScreen from '../../container/App/Account/WalletScreen';
import DoNotDisturb from '../../container/App/Account/DoNotDisturb';
import Notifications from '../../container/App/Home/Notifications';
import BookedEvents from '../../container/App/Events/BookedEvents';
import EventDetails from '../../container/App/Events/EventDetails';
import VerifyOTPScreen from '../../container/Auth/VerifyOTPScreen';
import EditProfile from '../../container/App/Account/EditProfile';
import CreateEvent from '../../container/App/Events/CreateEvent';
import EventTypes from '../../container/App/Events/EventTypes';
import BookEvent from '../../container/App/Events/BookEvent';
import Setting from '../../container/App/Account/Setting';
import HubScreen from '../../container/App/Hub/HubScreen';
import Snooze from '../../container/App/Account/Snooze';
import Account from '../../container/App/Account';
import {options, options_modal} from './utils';
import ChatFontSetting from '../../container/App/Account/ChatFontSetting';
import AddFriend from '../../container/App/Account/AddFriend';

import Contributors from '../../container/App/Contributors';
import Language from '../../container/App/Account/Language';
import AlertModalComponent from '../Components/AlertModalComponent';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'Reel'}>
      <Stack.Screen
        options={options}
        name={'Notifications'}
        component={Notifications}
      />
      <Stack.Screen
        options={options}
        name={'HubScreen'}
        component={HubScreen}
      />
      <Stack.Screen
        options={options}
        name={'BookedEvents'}
        component={BookedEvents}
      />
      <Stack.Screen
        options={options}
        name={'EventTypes'}
        component={EventTypes}
      />
      <Stack.Screen
        options={options}
        name={'ProfileEventTypes'}
        component={ProfileEventTypes}
      />
      <Stack.Screen
        name={'StripePaymentScreen'}
        options={options_modal}
        component={StripePaymentScreen}
      />
      <Stack.Screen
        options={options}
        name={'EventSettings'}
        component={EventSettings}
      />
      <Stack.Screen
        options={options}
        name={'UnderDevelopmentScreen'}
        component={UnderDevelopmentScreen}
      />

      <Stack.Screen
        options={options}
        name={'Wallet'}
        component={WalletScreen}
      />

      <Stack.Screen
        name={'WalletActivity'}
        component={WalletActivityScreen}
        options={{headerShown: false}}
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
        name={'BookEvent'}
        options={options_modal}
        component={BookEvent}
      />
      <Stack.Screen
        name={'VerifyOTPScreen'}
        component={VerifyOTPScreen}
        options={options}
      />
      <Stack.Screen
        options={options}
        name={'AccountVerification'}
        component={AccountVerification}
      />

      <Stack.Screen
        options={options}
        name={'ChatFont'}
        component={ChatFontSetting}
      />

      <Stack.Screen
        name={'AddFriend'}
        component={AddFriend}
        options={{headerShown: false}}
      />

      <Stack.Screen
        options={options}
        name={'EditProfile'}
        component={EditProfile}
      />
      <Stack.Screen
        options={options}
        name={'Contributors'}
        component={Contributors}
      />
      <Stack.Screen name={'Account'} component={Account} options={options} />
      <Stack.Screen
        name={'Setting'}
        component={Setting}
        options={options_modal}
      />
      <Stack.Screen
        name={'Language'}
        component={Language}
        options={options_modal}
      />
      <Stack.Screen
        name={'alert_modal'}
        component={AlertModalComponent}
        options={{
          animation: 'fade',
          headerShown: false,
          cardOverlayEnabled: true,
          animationTypeForReplace: 'pop',
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={'DoNotDisturb'}
        options={options_modal}
        component={DoNotDisturb}
      />
      <Stack.Screen
        name={'Snooze'}
        component={Snooze}
        options={options_modal}
      />
      <Stack.Screen
        name={'CreateEvent'}
        options={options_modal}
        component={CreateEvent}
      />
      <Stack.Screen
        name={'EventDetails'}
        options={options_modal}
        component={EventDetails}
      />
      <Stack.Screen
        options={options_modal}
        name={'TimezonePicker'}
        component={TimezonePicker}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
