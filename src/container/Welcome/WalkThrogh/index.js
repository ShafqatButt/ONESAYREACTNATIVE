import React, {useEffect, useState} from 'react';
import {
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  View,
  NativeEventEmitter,
} from 'react-native';
import {Spacer} from '../../../res/spacer';
// style themes and components
import {
  styles,
  SlideContainer,
  SkipWrapper,
  SliderTextWrapper,
  SliderImageWrapper,
  ContinueText,
} from './style';
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
  SubTitle,
} from '../../../res/globalStyles';
import {colors} from '../../../res/colors';
import {WALKTHROGH_DATA} from '../../../res/data';
import {fonts} from '../../../res/fonts';
import {images} from '../../../res/images';
import {saveData} from '../../../res/asyncStorageHelper';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
import * as Animatable from 'react-native-animatable';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getSearchParamsFromURL} from '../../../uikit-app';

export default WalkThrogh = props => {
  const [currentSlider, setCurrentslider] = useState(0);

  const refEventListener = React.useRef(null);

  const handleUrl = ({url}) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        handleChannelInvite(url).then();
      }
    });
  };

  const handleChannelInvite = async url => {
    if (typeof url !== 'string') {
      return;
    }

    const resolvedLink: string = await dynamicLinks()
      .resolveLink(url)
      .then(resolved => resolved);

    if (
      typeof resolvedLink?.url !== 'string' &&
      !resolvedLink?.url.includes('http')
    ) {
      return;
    }

    let _params = getSearchParamsFromURL(resolvedLink?.url);

    props.navigation.navigate('SignUp', {
      referCode: _params?.code || '',
    });
  };

  useEffect(() => {
    Linking.addEventListener('url', handleUrl);

    if (Platform.OS === 'android') {
      const eventEmitter = new NativeEventEmitter(null);
      refEventListener.current = eventEmitter.addListener(
        'onDeeplinkClicked',
        event => {
          console.log('refer code ===> ', event?.code);
          props.navigation.navigate('SignUp', {
            referCode: event?.code,
          });
        },
      );
    }

    return () => {
      if (Platform.OS === 'android') {
        if (refEventListener?.current !== null) {
          refEventListener?.current?.remove();
          refEventListener.current = null;
        }
      }
    };
  }, []);

  const onSeen = () => {
    saveData('isSeenWalkThrogh', 'yes');
    setTimeout(() => {
      props.navigation.navigate('Welcome');
    }, 1000);
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <GlobalFlex>
        {currentSlider != 3 && (
          <SkipWrapper
            onPress={() => {
              onSeen();
            }}
            activeOpacity={0.7}>
            <Text
              style={{
                color: colors.PRIMARY_COLOR,
                fontFamily: fonts.BOLD,
                fontSize: wp(4),
              }}>
              Skip
            </Text>
          </SkipWrapper>
        )}
        <SubContainer style={[{width: wp(100)}]}>
          <ImageSlider
            style={{backgroundColor: 'transparent'}}
            images={WALKTHROGH_DATA}
            position={currentSlider}
            onPositionChanged={index => {
              setCurrentslider(index);
            }}
            customSlide={({index, item, style, width}) => (
              // It's important to put style here because it's got offset inside
              <SlideContainer key={index} style={[style]}>
                <SliderImageWrapper>
                  <Spacer space={hp(4)} />
                  <AutoHeightImage source={item.Image} width={wp(75)} />
                </SliderImageWrapper>

                <SliderTextWrapper>
                  <Spacer space={hp(1)} />
                  <MainTitle>{item.Title}</MainTitle>
                  <Spacer space={hp(1)} />
                  <SubTitle style={[{fontSize: wp(4)}]}>
                    {item.Sub_Title}
                  </SubTitle>
                </SliderTextWrapper>
              </SlideContainer>
            )}
          />
        </SubContainer>
        <View style={styles.BottomWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              currentSlider == 3
                ? onSeen()
                : setCurrentslider(currentSlider + 1);
            }}
            style={{
              width: '100%',
              height: '100%',
              flexDirection: 'row',
              paddingHorizontal: wp(5),
            }}>
            {currentSlider == 3 ? <ContinueText>Continue</ContinueText> : null}
            <AutoHeightImage
              source={images.rightArrow_ic}
              width={wp(3.8)}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </GlobalFlex>
    </>
  );
};
