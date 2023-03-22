// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {Image, View, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RegularText} from '../style';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import styles, {HeaderShadowLine} from './style';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import {GET_DATA} from '../../../../api_helper/ApiServices';
import deviceInfoModule from 'react-native-device-info';
import {GET_WALLETS} from '../../../../api_helper/Api';
import {AuthContext} from '../../../../context/Auth.context';
import Strings from '../../../../string_key/Strings';

export default WalletScreen = props => {
  // const { title } = props?.route?.params;
  const {state: ContextState} = useContext(AuthContext);
  const {userData} = ContextState;
  const [walletData, setWalletData] = useState([]);

  useEffect(() => {
    getWalletList();
  }, [userData]);

  const getWalletList = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    console.log('uniqe id', uniqueID);
    GET_DATA(GET_WALLETS, true, userData?.token, uniqueID, data => {
      setWalletData(data);
    });
  };

  return (
    <GlobalFlex>
      <View>
        <BackHeader
          is_center_text
          title={Strings.my_wallet}
          onBackPress={() => props.navigation.goBack()}
        />
        <Spacer space={wp(1.5)} />
        <HeaderShadowLine />
      </View>
      <Spacer space={hp(1)} />

      <FlatList
        style={{flex: 1}}
        bounces={false}
        data={walletData}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('WalletActivity', {
                wallet_type: item?.name,
              });
            }}>
            <View
              style={{
                width: wp(92),
                borderRadius: wp(2),
                alignSelf: 'center',
                backgroundColor: colors.BORDER_COLOR,
                borderColor: colors.PRIMARY_COLOR,
                borderWidth: wp(0.2),
              }}>
              <View style={{padding: wp(2)}}>
                <RegularText style={{textAlign: 'left'}}>
                  {item?.name}
                </RegularText>
                <Spacer space={hp(1)} />
                <>
                  <RegularText style={styles.txt_regular}>
                    {item?.balance}
                  </RegularText>
                  <RegularText
                    style={{fontSize: wp(4), color: colors.PRIMARY_COLOR}}>
                    {` ${Strings.points}`}
                  </RegularText>
                </>
                <Spacer space={hp(1)} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RegularText style={{textAlign: 'left', fontSize: wp(3.5)}}>
                    {`${Strings.total} : ` + item?.total}
                  </RegularText>
                  <RegularText style={{textAlign: 'left', fontSize: wp(3.5)}}>
                    {`${Strings.spent} : ` + item?.spent}
                  </RegularText>
                </View>
              </View>
            </View>
            <Spacer space={hp(1)} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </GlobalFlex>
  );
};
