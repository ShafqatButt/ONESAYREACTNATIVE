// noinspection ES6CheckImport

import React, {useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import DirectCallVideoCallingScreen from '../../container/App/CallContainer/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from '../../container/App/CallContainer/DirectCallVoiceCallingScreen';
import StereoCardDetail from '../../container/App/SterioCard/StereoCardDetail';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StripePaymentScreen from '../../container/App/StripePaymentScreen';
import MembershipScreen from '../../container/App/MembershipScreen';
import FileViewerScreen from '../../uikit-app/FileViewerScreen';
import SterioCard from '../../container/App/SterioCard';
// import {AuthContext} from '../../context/Auth.context';
// import {ReelContext} from '../../context/ReelContext';
import {DirectRoutes} from '../../navigations/routes';
// import {getData} from '../../res/asyncStorageHelper';
import {options, options_modal} from './utils';
import {Routes} from '../../libs/navigation';
import Home from '../../container/App/Home';
import {
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelScreen,
  GroupChannelSettingsScreen,
} from '../../uikit-app';
import DirectCallHistoryScreen from '../../container/App/CallContainer/DirectCallHistoryScreen';
import FAVerification from '../../container/App/Account/FAVerification';
import Disable2FA from '../../container/App/Account/Disable2FA';
import Invitations from '../../container/App/Account/Invitations';
import DeleteAccount from '../../container/App/Account/DeleteAccount';
import ReasonModal from '../../container/App/Account/ReasonModal';
import VerifyOTPScreen from '../../container/Auth/VerifyOTPScreen';
import MyOrder from '../../container/App/Home/MyOrder';
import WalletActivityScreen from '../../container/App/Account/WalletActivityScreen';
import ProfileNavigator from './ProfileNavigator';
import HubstackNavigator from './HubstackNavigator';
import ProductCategories from '../../container/App/Hub/ProductCategories';
import VendorSignup from '../../container/App/Hub/VendorSignup';
import AddCategory from '../../container/App/Hub/AddCategory';
import AddProducts from '../../container/App/Hub/AddProducts';
import ProductList from '../../container/App/Hub/ProductList';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  // Initialize context api
  // const {defaultLogin} = useContext(AuthContext);
  // const {actionGetUserReels, actionGetReelList} = useContext(ReelContext);
  //
  // useEffect(() => {
  //   actionGetUserReels();
  //   actionGetReelList();
  //   getData(
  //     'userDetails',
  //     success => {
  //       defaultLogin(success);
  //     },
  //     failure => {},
  //   );
  // }, []);
  return (
    <Stack.Navigator initialRouteName={'Home'}>
      <Stack.Screen name={'Home'} component={Home} options={options} />
      <Stack.Group
        screenOptions={{presentation: 'containedModal', headerShown: false}}>
        <Stack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
      </Stack.Group>
      <Stack.Screen
        name={Routes.GroupChannel}
        options={options}
        component={GroupChannelScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelSettings}
        options={options}
        component={GroupChannelSettingsScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelCreate}
        options={options}
        component={GroupChannelCreateScreen}
      />
      <Stack.Screen
        name={Routes.MyOrders}
        options={options}
        component={MyOrder}
      />
      <Stack.Screen
        name={Routes.GroupChannelInvite}
        options={options}
        component={GroupChannelInviteScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelMembers}
        options={options}
        component={GroupChannelMembersScreen}
      />
      <Stack.Screen
        name={'VerifyOTPScreen'}
        component={VerifyOTPScreen}
        options={options}
      />
      <Stack.Screen
        name={'SterioCard'}
        component={SterioCard}
        options={options}
      />
      <Stack.Screen
        name={'StereoCardDetail'}
        component={StereoCardDetail}
        options={options}
      />
      <Stack.Screen
        name={'DeleteAccount'}
        component={DeleteAccount}
        options={options}
      />
      <Stack.Screen
        name={'Invitations'}
        component={Invitations}
        options={options}
      />
      <Stack.Screen
        name={'CallHistory'}
        component={DirectCallHistoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'Disable2FA'}
        component={Disable2FA}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'WalletActivity'}
        component={WalletActivityScreen}
        options={{headerShown: false}}
      />
      {/* //////////////Moved from App Navigator */}
      <Stack.Screen
        name={'ProfileNav'}
        component={ProfileNavigator}
        options={options}
      />
      <Stack.Screen
        name={'MarketPlaceNav'}
        component={HubstackNavigator}
        options={options}
      />
      {/* //////////////////////////////////// */}
      <Stack.Group screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen
          name={DirectRoutes.VIDEO_CALLING}
          component={DirectCallVideoCallingScreen}
        />
        <Stack.Screen
          name={DirectRoutes.VOICE_CALLING}
          component={DirectCallVoiceCallingScreen}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: Platform.OS !== 'android',
        }}>
        <Stack.Screen name={'ReasonModal'} component={ReasonModal} />
        <Stack.Screen name={'FAVerification'} component={FAVerification} />
        <Stack.Screen name={'Membership'} component={MembershipScreen} />
        <Stack.Screen
          name={'StripePaymentScreen'}
          component={StripePaymentScreen}
        />
      </Stack.Group>

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
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
