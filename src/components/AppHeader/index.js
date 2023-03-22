// noinspection ES6CheckImport
import React, {useContext, useEffect} from 'react';
import {Text, TouchableOpacity, Image, View, Pressable} from 'react-native';
import {ActivityDot, ImgBackGroundgContainer} from '../../res/globalStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../res/colors';
import {images} from '../../res/images';
import {fonts} from '../../res/fonts';
import {styles} from './style';

import {NotificationBadge} from '../../components/NotificationBadge/index';
import {AppHeaderContext} from '../AppHeaderContext';
import {useIsFocused} from '@react-navigation/core';

export const AppHeader = props => {
  const {pendingNotifications, userData, onBackPress = null} = props;

  const isFocused = useIsFocused();
  const {state: ContextState, getNotificationCount_WalletTotal} =
    useContext(AppHeaderContext);
  const {notificationCount} = ContextState;

  useEffect(() => {
    console.log('Coming back to AppHeader');

    if (isFocused) {
      console.log('calling it first time..', userData);
      getNotificationCount_WalletTotal(userData?.token);
    }

    console.log('Count is here', notificationCount);
  }, [notificationCount, isFocused]);

  return (
    <>
      <ImgBackGroundgContainer source={images.menu_line} resizeMode={'stretch'}>
        <View style={styles.imageWrapper}>
          <View style={styles.flexWrapper}>
            <View style={styles.flexInnerWrapper}>
              {onBackPress !== null && (
                <Pressable style={{alignSelf: 'center'}} onPress={onBackPress}>
                  <Image
                    source={images.back_white}
                    style={styles.icBackStyle}
                  />
                </Pressable>
              )}
              <Image
                source={
                  userData?.avatar?.length > 0
                    ? {uri: userData?.avatar}
                    : images.avatar
                }
                style={styles.profile_ic}
              />
              <View style={{alignSelf: 'center', marginLeft: wp(2)}}>
                <Text
                  style={{
                    color: colors.WHITE,
                    fontSize: wp(4),
                    textAlign: 'left',
                  }}>
                  {props.userData != null && props.userData?.displayName}{' '}
                </Text>
                <Text
                  style={{
                    color: colors.WHITE,
                    fontSize: wp(3),
                    textAlign: 'left',
                    fontFamily: fonts.MEDIUM,
                  }}>
                  {`@${userData?.username}`}{' '}
                </Text>
              </View>
            </View>
            <View style={styles.flexInnerWrapper}>
              <TouchableOpacity
                onPress={() => {
                  props.onNotification();
                }}>
                {notificationCount > 0 && (
                  <NotificationBadge text={notificationCount} />
                )}

                <Image
                  style={styles.image_ic}
                  source={images.notification_ic}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.action_open();
                }}>
                {pendingNotifications && <ActivityDot />}
                <Image style={styles.image_ic} source={images.setting_bar_ic} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImgBackGroundgContainer>
    </>
  );
};
