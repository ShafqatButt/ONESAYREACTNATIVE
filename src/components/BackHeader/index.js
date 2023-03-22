import React from 'react';
// noinspection ES6CheckImport
import {
  Text,
  View,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {GlobalHeader, GlobalSubHeader} from '../../res/globalStyles';
import {colors} from '../../res/colors';
import {images} from '../../res/images';
import {fonts} from '../../res/fonts';
import styles, {Icon} from './style';
import Strings from '../../string_key/Strings';

export const BackHeader = props => {
  const {showBack = true} = props;
  return (
    <>
      <SafeAreaView />
      <StatusBar barStyle={'dark-content'} />
      <GlobalHeader
        isModal={props?.isModal}
        style={[props.background, props.headerStyle]}>
        <GlobalSubHeader>
          {showBack && (
            <TouchableOpacity onPress={() => props.onBackPress()}>
              {props.isLeftText ? (
                <View style={{padding: wp(2), marginLeft: wp(4)}}>
                  <Text
                    style={[
                      styles.text_center,
                      props.textColor,
                      props.leftTextColor,
                      {fontSize: wp(3.8), fontFamily: fonts.REGULAR},
                    ]}>
                    {props?.backTitle || Strings.Cancel}
                  </Text>
                </View>
              ) : (
                <Image
                  source={images.back_black}
                  style={[
                    styles.backIcon,
                    {tintColor: props?.textColor?.color},
                  ]}
                />
              )}
            </TouchableOpacity>
          )}
          {props?.searchBar}
          {props.is_center_text && (
            <Text style={[styles.text_center, props.textColor]}>
              {props.title}
            </Text>
          )}
          {props.isRightText ? (
            props.isLoading ? (
              <View style={{position: 'absolute', right: wp(1)}}>
                <ActivityIndicator size={'small'} color={colors.WHITE} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => props.onNextPress()}
                style={{
                  position: 'absolute',
                  right: props?.rightIcon ? 0 : wp(4),
                }}>
                {props?.rightIcon ? (
                  <Icon source={props?.rightIcon} />
                ) : (
                  <Text
                    style={[
                      styles.text_center,
                      props.textColor,
                      {fontSize: wp(3.8), fontFamily: fonts.REGULAR},
                      props?.nextTextStyle,
                    ]}>
                    {props.rightText}
                  </Text>
                )}
              </TouchableOpacity>
            )
          ) : null}
        </GlobalSubHeader>
        {props?.title?.length < 1 && props?.children}
      </GlobalHeader>
    </>
  );
};
