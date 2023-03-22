// noinspection ES6CheckImport

import React, {useEffect, useState, useContext} from 'react';
import {
  TouchableOpacity,
  Platform,
  Image,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ReelContainer from '../../../container/App/ReelCotainer';
import HomeDashboard from '../../../container/App/HomeDashboard';
import {ReelContext} from '../../../context/ReelContext';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import styles, {HeaderShadowLine, RegularText} from './style';
import {BackHeader} from '../../../components/BackHeader';
import {GlobalFlex} from '../../../res/globalStyles';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fonts} from '../../../res/fonts';
import {EventRegister} from 'react-native-event-listeners';
import Strings from '../../../string_key/Strings';
import { AuthContext } from "../../../context/Auth.context";
import realm from '../../../realmStore';
import {useStorePhoneContactsRealm} from '../../../hooks/useStorePhoneContactsRealm';


const isHome = true;
const Tab = createMaterialTopTabNavigator();

const MyComponent1 = props => {
  const [myreelData, setMyReelData] = useState([]);

  const [MathRandom, setMathRandom] = useState(Math.random());

  const {top} = useSafeAreaInsets();
  const {
    state: ContextState,
    actionGetReelList,
    actionGetUserReels,
  } = useContext(ReelContext);
  const {userReelData, globalReelData, fetchingCommunityReels} = ContextState;

  const loadReel = () => {
    setMyReelData(userReelData);
    // console.log('load reel', userReelData);

    setMathRandom(Math.random());
  };
  useEffect(() => {
    actionGetUserReels();
  }, []);
  useEffect(() => {
    // console.log('getting user reels', userReelData);

    loadReel();
  }, [userReelData]);

  return (
    <ReelContainer
      isHome={isHome}
      index={0}
      myreelData={myreelData}
      MathRandom={MathRandom}
    />
  );
};
const MyComponent2 = props => {
  const [reelData, setReelData] = useState([]);
  const [MathRandom, setMathRandom] = useState(Math.random());

  const {top} = useSafeAreaInsets();
  const {
    state: ContextState,
    actionGetReelList,
    actionGetUserReels,
  } = useContext(ReelContext);
  const {userReelData, globalReelData, fetchingCommunityReels} = ContextState;

  const loadReel = () => {
    setReelData(globalReelData);

    setMathRandom(Math.random());
  };
  useEffect(() => {
    actionGetReelList();
  }, []);
  useEffect(() => {
    loadReel();
  }, [globalReelData]);
  return (
    <ReelContainer
      isHome={isHome}
      index={1}
      reelData={reelData}
      MathRandom={MathRandom}
    />
  );
};

const MyTopTab = props => {
  // useEffect(() => {}, [Strings]);
  const {top} = useSafeAreaInsets();
  const {state: AuthState} = useContext(AuthContext);
  const TAB_NAMES = [Strings.feed, Strings.reels, Strings.myposts];
  const [renderKey, setRenderKey] = useState(12332);

  useEffect(() => {
    setRenderKey(prevKey => ++prevKey);
  }, [AuthState?.selectedLang]);

  return (
    <View
      key={renderKey}
      style={{
        minWidth: '80%',
        position: 'absolute',
        zIndex: 100,
        top: top + hp(1),
        flexDirection: 'row',
      }}>
      {TAB_NAMES.map((item, index) => (
        <Pressable
          onPress={() => {
            switch (index) {
              case 0:
                props.navigation.navigate('Feed');
                break;
              case 1:
                props.navigation.navigate('Reels');
                break;
              case 2:
                props.navigation.navigate('MyPosts');
                break;
              default:
                console.log('');
            }
          }}
          style={{
            ...styles.tab_wrapper,
            borderBottomColor:
              index == props.navigationState.index
                ? colors.PRIMARY_COLOR
                : colors.PAINT_BORDER,
            borderBottomWidth:
              index == props.navigationState.index ? wp(0.5) : 0,
          }}>
          <Text
            style={{
              ...styles.tabText,
              fontFamily:
                index == props.navigationState.index
                  ? fonts.BOLD
                  : fonts.REGULAR,
              color:
                index == props.navigationState.index
                  ? colors.PRIMARY_COLOR
                  : colors.BLACK,
            }}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default FeedReelScreen = props => {

  const [contactData, setContactData] = useState(refContactsData?.current);

  const refContactsData = React.useRef([
    ...realm.objects('Contact').sorted('givenName'),
  ]);

  const {
    state: ContextState,
    actionGetReelList,
    actionGetUserReels,
  } = useContext(ReelContext);
  const {userReelData, globalReelData, fetchingCommunityReels} = ContextState;
  
  const [addContact, syncContacts, getContacts, syncContactsIfRequired] =
    useStorePhoneContactsRealm();
  
    useEffect(() => {
      syncContactsIfRequired(response => {
        if (response.syncRequired) {
          if (response.isLoading) {
            refContactsData.current = null;
            setContactData(() => []);
          } else {
            refContactsData.current = response.contacts;
            setContactData(() => refContactsData.current);
          }
        }
      }, refContactsData?.current?.length);
    }, []);
  
    useEffect(() => {
            syncContacts(contacts => {
            refContactsData.current = contacts;
            setContactData(() => refContactsData.current);
          });
      }, []);

      useEffect(() => {
        
          
          actionGetReelList();
          actionGetUserReels();
       
      }, []);


  return (
    <GlobalFlex style={{paddingTop: 0}}>
      {/* {isHome ? (
        <View
          style={{
            ...styles.flex_wrapper,

            position: 'absolute',
            top: top + hp(1),
            zIndex: 100,
          }}>
          <TouchableOpacity
            onPress={() => {
              setIndex(0);
            }}
            style={{
              ...styles.tab_wrapper,
              borderBottomColor:
                index == 0 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
              borderBottomWidth: index == 0 ? wp(0.5) : 0,
            }}>
            <Text
              style={{
                ...styles.tabText,
                fontFamily: index == 0 ? fonts.BOLD : fonts.REGULAR,
                color: index == 0 ? colors.PRIMARY_COLOR : colors.BLACK,
              }}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIndex(1);
            }}
            style={{
              ...styles.tab_wrapper,
              borderBottomColor:
                index == 1 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,

              borderBottomWidth: index == 1 ? wp(0.5) : 0,
            }}>
            <Text
              style={{
                ...styles.tabText,
                fontFamily: index == 1 ? fonts.BOLD : fonts.REGULAR,
                color: index == 1 ? colors.PRIMARY_COLOR : colors.BLACK,
              }}>
              Reels
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIndex(2);
            }}
            style={{
              ...styles.tab_wrapper,
              borderBottomColor:
                index == 2 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
              borderBottomWidth: index == 2 ? wp(0.5) : 0,
            }}>
            <Text
              style={{
                ...styles.tabText,
                fontFamily: index == 2 ? fonts.BOLD : fonts.REGULAR,
                color: index == 2 ? colors.PRIMARY_COLOR : colors.BLACK,
              }}>
              My Posts
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {index == 0 ? (
        <HomeDashboard isHome={isHome} />
      ) : index == 1 ? (
        <ReelContainer
          isHome={isHome}
          index={1}
          key={0}
          reelData={reelData}
          MathRandom={MathRandom}
        />
      ) : (
        <ReelContainer
          isHome={isHome}
          index={0}
          key={1}
          myreelData={myreelData}
          MathRandom={MathRandom}
        /> //index==0 for my posts
      )} */}
      {/* <SafeAreaView /> */}
      <Tab.Navigator
        initialRouteName={Strings.feed}
        // lazy={false}
        tabBar={props => <MyTopTab {...props} />}>
        <Tab.Screen
          name="Feed"
          initialParams={{isHome: isHome}} 
          component={HomeDashboard}
        />

        <Tab.Screen name="Reels" component={MyComponent2} />

        <Tab.Screen name="MyPosts" component={MyComponent1} />
      </Tab.Navigator>
    </GlobalFlex>
  );
};
