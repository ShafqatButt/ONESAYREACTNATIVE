// noinspection ES6CheckImport

import React, {useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import MembershipComponent from './components/MembershipComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {BackHeader} from '../../../components/BackHeader';
import {AuthContext} from '../../../context/Auth.context';
import {GET_MEMBERSHIPS} from '../../../api_helper/Api';
import {GlobalFlex} from '../../../res/globalStyles';
import {GET, PATCH, POST} from '../../../api_helper/ApiServices';
import {PATCH_UPDATE_PROFILE, POST_ORDER} from '../../../api_helper/Api';
import styles, {SkipButton, SkipText, TitleText} from './style';
import {saveData} from '../../../res/asyncStorageHelper';
import {Button} from '../../../components/Button';
import DeviceInfo from 'react-native-device-info';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import Strings from '../../../string_key/Strings';

export default MembershipScreen = props => {
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const [selected, setSelected] = useState({
    id: '',
    data: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [memberships, setMemberships] = useState([]);

  const [refAlreadyMember, setRefAlreadyMember] = useState({
    current: {
      membership: null, //ContextState?.userData?.membership,
      isMember: false, //typeof ContextState?.userData?.membership === 'object',
    },
  });

  useEffect(() => {
    saveData('isMembershipSkipped', true);
    // setRefAlreadyMember(() => {
    //   return {
    //     current: {
    //       membership: ContextState?.userData?.membership,
    //       isMember:
    //         typeof ContextState?.userData?.membership === 'object' &&
    //         ContextState?.userData?.membership !== null,
    //     },
    //   };
    // });
  }, [ContextState]);

  const getMemberships = async () => {
    setLoading(() => true);
    const user = await AsyncStorage.getItem('userDetails').then(user =>
      JSON.parse(user),
    );
    DeviceInfo.getUniqueId()
      .then(device_d => GET(GET_MEMBERSHIPS(), user.token, device_d))
      .then(response => {
        setLoading(() => false);
        setMemberships(() =>
          response.data.filter(
            obj => obj.id !== ContextState?.userData?.membership?.id,
          ),
        );
      })
      .catch(e => {
        setLoading(() => false);
        console.log('error => ', e.message);
      });
  };

  useEffect(() => {
    // if (
    //   memberships?.length < 1 &&
    //   typeof ContextState?.userData?.membership === 'object' &&
    //   ContextState?.userData?.membership === null
    // ) {
    getMemberships().then();
    // }
  }, []);

  const onMembershipSelected = async () => {
    setLoading(() => true);
    setUpdating(() => true);

    const userData = await AsyncStorage.getItem('userDetails').then(data =>
      JSON.parse(data),
    );
    const uniqueID = await DeviceInfo.getUniqueId();

    // url,
    //   is_auth,
    //   token,
    //   device_id,
    //   postData,
    //   callBack,
    POST(
      POST_ORDER,
      true,
      userData.token,
      uniqueID,
      {
        product_id: selected?.data?.product_id,
      },
      (res, e) => {
        setLoading(() => false);
        setUpdating(() => false);
        if (!e) {
          props.navigation.navigate('StripePaymentScreen', {
            siteLink: res?.payment_link,
            orderId: res?.order?.order_id,
            productId: selected?.id,
            membership: selected?.data,
            isMembershipFlow: true,
          });
        } else {
          console.log('PATCH_UPDATE_PROFILE (error)2 => ', res);
        }
      },
    );
    return;

    const url = PATCH_UPDATE_PROFILE(userData.userId);

    PATCH(
      url,
      userData.token,
      uniqueID,
      {
        membershipId: selected?.id,
      },
      (res, e) => {
        setLoading(() => false);
        setUpdating(() => false);
        if (!e) {
          updateUserData(res);
          props.navigation.goBack();
        } else {
          console.log('PATCH_UPDATE_PROFILE (error) => ', res);
        }
      },
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        is_center_text
        isLeftText={true}
        backTitle={
          refAlreadyMember?.current?.isMember ? Strings.back : Strings.later
        }
        title={Strings.membership}
        textColor={{color: colors.WHITE}}
        onBackPress={() => props.navigation.goBack()}
        background={{
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
          backgroundColor: colors.PRIMARY_COLOR,
        }}
      />
      <Spacer space={wp('4%')} />

      {refAlreadyMember?.current?.isMember ? (
        <TitleText>Thank you for choosing Buzzmi membership.</TitleText>
      ) : (
        <TitleText>{Strings.select_membership}</TitleText>
      )}
      <ScrollView style={{flex: 1, backgroundColor: colors.WHITE}}>
        {refAlreadyMember?.current?.isMember ? (
          <>
            <Spacer space={wp('4%')} />
            <MembershipComponent
              index={5}
              price={refAlreadyMember?.current?.membership?.price}
              title={refAlreadyMember?.current?.membership?.title}
              isSelected={true}
              description={refAlreadyMember?.current?.membership?.description}
              onPress={() => console.log('Already a member.')}
            />
          </>
        ) : (
          memberships.map((membership, index) => (
            <View key={membership.id}>
              <Spacer space={wp('4%')} />
              <MembershipComponent
                index={index}
                price={membership.price}
                title={membership.title}
                isSelected={membership.id === selected.id}
                description={membership.description}
                onPress={() =>
                  setSelected(() => ({
                    id: membership.id,
                    data: membership,
                  }))
                }
              />
            </View>
          ))
        )}
        <Spacer space={wp('2%')} />
      </ScrollView>
      {!refAlreadyMember?.current?.isMember && (
        <>
          <Spacer space={wp('4%')} />
          <Button
            isLoading={updating}
            disabled={selected?.id?.length < 1}
            buttonText={Strings.get_this_membership}
            buttonPress={() => onMembershipSelected()}
          />
          <Spacer space={wp('2%')} />
          <SkipButton onPress={() => props.navigation.goBack()}>
            <SkipText>
              {refAlreadyMember?.current?.isMember
                ? Strings.go_back
                : Strings.dismiss}
            </SkipText>
          </SkipButton>
          <Spacer space={wp('5%')} />
        </>
      )}
      {loading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(90),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};
