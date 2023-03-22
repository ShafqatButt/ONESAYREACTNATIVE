import React, {useEffect, useState} from 'react';
import UpdatePasswordScreen from '../../container/Auth/UpdatePasswordScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VerifyOTPScreen from '../../container/Auth/VerifyOTPScreen';
import ForgetPassword from '../../container/Auth/ForgetPassword';
import WalkThrogh from '../../container/Welcome/WalkThrogh';
import Welcome from '../../container/Welcome/Welcome';
import {getData} from '../../res/asyncStorageHelper';
import SignUp from '../../container/Auth/SignUp';
import Login from '../../container/Auth/Login';
import {options} from './utils';
import ContactUs from '../../container/Auth/ContactUs';


const Stack = createNativeStackNavigator();

const AuthStackNavigator = props => {
  console.log('propps in auth stack===>', props.route.params);
  const [initialPageName, setInitialPageName] = useState('');
  useEffect(() => {
    getData(
      'isSeenWalkThrogh',
      success => {
        setInitialPageName(success == 'yes' ? 'Welcome' : 'WalkThrogh');
      },
      failure => {
        setInitialPageName('WalkThrogh');
      },
    );
  }, []);

  return initialPageName === '' ? null : (
    <Stack.Navigator initialRouteName={initialPageName}>
      <Stack.Screen
        name={'WalkThrogh'}
        component={WalkThrogh}
        options={options}
      />
      <Stack.Screen
        name={'Welcome'}
        component={Welcome}
        options={options}
        initialParams={props.route.params}
      />
      <Stack.Screen name={'Login'} component={Login} options={options} />
      <Stack.Screen
        name={'ForgetPassword'}
        component={ForgetPassword}
        options={options}
      />
      <Stack.Screen
        name={'VerifyOTPScreen'}
        component={VerifyOTPScreen}
        options={options}
      />
      <Stack.Screen
        component={UpdatePasswordScreen}
        name={'UpdatePasswordScreen'}
        options={options}
      />
      <Stack.Screen name={'SignUp'} component={SignUp} options={options} />
      <Stack.Screen name={'ContactUs'} component={ContactUs} options={options} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
