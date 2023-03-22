import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {GET_WALLETS} from '../../../../../api_helper/Api';
import {GET_DATA} from '../../../../../api_helper/ApiServices';
import {AuthContext} from '../../../../../context/Auth.context';
import {colors} from '../../../../../res/colors';
import {images} from '../../../../../res/images';
import styles, {
  Item,
  SubItem,
  Divider,
  Container,
  LabelText,
  DetailText,
  DiamondIcon,
  ClickableText,
  ClickableTextContainer,
} from './styles';
import {AppHeaderContext} from '../../../../../components/AppHeaderContext';
import Strings from '../../../../../string_key/Strings';

const BasicInfoComponent = props => {
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  // console.log('userDate', userData);
  const [balance, setBalance] = useState(0);
  const [isloading, setIsLoading] = useState(false);

  const {state: walletContext} = useContext(AppHeaderContext);
  const {walletTotal} = walletContext;

  const getWalletList = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    console.log('uniqe id', uniqueID);
    if (uniqueID.length) {
      setIsLoading(true);
      await GET_DATA(GET_WALLETS, true, userData?.token, uniqueID, data => {
        console.log('wallet data', data);
        if (!Array.isArray(data)) {
          setBalance('Unavailable');
        } else {
          setBalance(
            data.map(item => item?.balance).reduce((prev, next) => prev + next),
          );
        }

        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    //getWalletList();
    setBalance(walletTotal);
  }, [userData, walletTotal]);
  return (
    <Container style={styles.shadowStyle}>
      <Item>
        {!props?.onWalletPress && (
          <LabelText>{Strings.sa_str_wallet}</LabelText>
        )}
        <SubItem>
          {/* {!props?.onWalletPress && (
            <DiamondIcon
              resizeMode={'contain'}
              source={images.notification_ic}
            />
          )} */}
          <Pressable
            onPress={() => {
              // if (props?.onWalletPress) {
              //   props?.onWalletPress();
              // }
            }}>
            {/* <DetailText>{!props?.onWalletPress ? '0' : 'MY WALLET'}</DetailText> */}

            {isloading ? (
              <ActivityIndicator size={20} color={colors.PRIMARY_COLOR} />
            ) : (
              <DetailText>{balance}</DetailText>
            )}
          </Pressable>
        </SubItem>
      </Item>
      <Divider />
      <Item>
        <LabelText>{Strings.membership_level}</LabelText>
        <SubItem>
          <DetailText>{userData?.membership?.title || 'Free User'}</DetailText>
        </SubItem>
        <ClickableTextContainer
          onPress={() => {
            if (!props?.onWalletPress) {
              if (props?.onManagePress) {
                props?.onManagePress();
              }
            } else {
              if (props?.onBenefitsPress) {
                props?.onBenefitsPress();
              }
            }
          }}>
          <ClickableText>
            {props?.onWalletPress
              ? Strings.see_your_benefits
              : ContextState?.userData?.membership !== null
              ? Strings.update
              : Strings.manage}
          </ClickableText>
        </ClickableTextContainer>
      </Item>
    </Container>
  );
};

export default BasicInfoComponent;
