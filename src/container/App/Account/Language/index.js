import React, {useContext} from 'react';
import {View, FlatList, Image} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {AuthContext} from '../../../../context/Auth.context';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
// Third Party library

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActionWrapper, BorderContainer, Text} from './style';
import {fonts} from '../../../../res/fonts';

import Strings from '../../../../string_key/Strings';
import {images} from '../../../../res/images';

export default Language = props => {
  const Languages = [
    {name: Strings.english, tag: 'en'},
    {name: Strings.spanish, tag: 'es'},
  ];
  const showTick = tag => Strings.getLanguage() == tag;
  const {state: ContextState, updateSelectedLang} = useContext(AuthContext);
  const {selectedLang} = ContextState;

  return (
    <GlobalFlex>
      <BackHeader
        isModal
        onBackPress={() => props.navigation.goBack()}
        is_center_text
        title={Strings.Languages}
      />
      <Spacer space={hp(1)} />
      <BorderContainer />

      <View style={{flex: 1}}>
        <FlatList
          data={Languages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <>
              <ActionWrapper
                onPress={() => {
                  if (showTick(item.tag)) return;
                  props.navigation.navigate('alert_modal', {
                    title: Strings.Change_Language,
                    message: `${Strings.App_Language_Changed_to} ${item.name}.`,

                    btnText: Strings.OK,
                    onBtnPress: () => {
                      console.log('item.tag ==> ', item.tag);
                      // Strings.setLanguage(item.tag);
                      updateSelectedLang(item.tag);
                      props.navigation.goBack();
                    },
                    isCancel: true,
                  });
                }}>
                <Text
                  style={[{alignSelf: 'center', fontFamily: fonts.REGULAR}]}>
                  {item.name}
                </Text>

                {showTick(item.tag) ? (
                  <Image
                    source={images.ic_done}
                    style={{height: wp(5), width: wp(5)}}
                  />
                ) : null}
              </ActionWrapper>
              <BorderContainer />
            </>
          )}
        />
      </View>
    </GlobalFlex>
  );
};
