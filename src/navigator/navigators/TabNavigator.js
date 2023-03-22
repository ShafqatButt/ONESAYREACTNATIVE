// noinspection ES6CheckImport

import React from 'react';
import UnderDevelopmentScreen from '../../container/App/Account/UnderDevelopmentScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FeedReelScreen from '../../container/App/FeedReelScreen';
import DiscoverStackNavigator from './DiscoverStackNavigator';
import MyBottomTabBar from '../Components/MyBottomTabBar';
import ReelStackNavigator from './ReelStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import HubstackNavigator from './HubstackNavigator';
import {TAB_NAMES} from '../Components/Constants';
import {GroupChannelTabs} from '../../uikit-app';

import TripsNavigator from './TripsStackNavigator';

const Tab = createBottomTabNavigator();

const PayScreenComponent = () => {
  return null;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={TAB_NAMES[0]}
      tabBar={props => (
        <MyBottomTabBar {...props} index={props?.state?.index} />
      )}>
      {/* <Tab.Screen name={TAB_NAMES[0]} component={UnderDevelopmentScreen} /> */}

      <Tab.Screen name={TAB_NAMES[0]} component={ReelStackNavigator} />

      <Tab.Screen name={TAB_NAMES[1]} component={GroupChannelTabs} />

      <Tab.Screen name={TAB_NAMES[2]} component={DiscoverStackNavigator} />

      {/*<Tab.Screen name={TAB_NAMES[4]} component={HubstackNavigator} />*/}
      <Tab.Screen name={TAB_NAMES[3]} component={TripsNavigator} />
      <Tab.Screen name={TAB_NAMES[4]} component={HomeStackNavigator} />
      {/* <Tab.Screen name={TAB_NAMES[6]} component={FeedReelScreen} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
