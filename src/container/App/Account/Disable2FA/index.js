import React, { useContext, useState, useEffect } from 'react';
import {
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import {
    GlobalFlex,
    MainTitle,
    SubContainer,
} from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { GET_DATA, POST, POST_DATA } from "../../../../api_helper/ApiServices";
import { styles, Text, BorderContainer } from './style';
import { AuthContext } from '../../../../context/Auth.context';
import { colors } from '../../../../res/colors';
// Third Party library
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { POST_QR_CODE } from "../../../../api_helper/Api";
import AsyncStorage from '@react-native-community/async-storage';
import { fonts } from '../../../../res/fonts';
import { Input } from '../../../../components/Input';
import { saveData } from '../../../../res/asyncStorageHelper';

export default Disable2FA = props => {
    const [flexOneWidth, setFlexOneWidth] = useState(0);
    const { state: ContextState, logout } = useContext(AuthContext);
    const { userData } = ContextState;
    const [code, setCode] = useState('');

    const onDisableOTP = async () => {
        const userData = await AsyncStorage.getItem('userDetails');
        let postData = {
            "userId": JSON.parse(userData).userId,
            "totp": code,
            "isTFAEnabled": false
        }
        POST_DATA(POST_QR_CODE, JSON.parse(userData).token, postData, (data, flag) => {
            if (flag == false && data?.otpValid) {
                saveData('userDetails', Object.assign(JSON.parse(userData), { twoFactorAuthEnabled: data?.isTFAEnabled }))
                Alert.alert(
                    "Buzzmi",
                    "2FA disabled successfully",
                    [
                        {
                            text: 'Okay',
                            onPress: () => {
                                props.navigation.goBack()
                            },
                        },
                    ],
                    { cancelable: false },
                );
            }
        })
    }

    return (
        <GlobalFlex>
            <>
                <BackHeader
                    textColor={{ color: colors.DARK_GRAY }}
                    isRightText={false}
                    onBackPress={() => { props.navigation.goBack() }}
                    is_center_text
                    title={"Disable 2FA"}
                />
                <Spacer space={hp(1)} />
                <View style={styles.borderView} />
            </>
            <SubContainer style={[{ width: wp(90), alignSelf: "center" }]}>
                <Spacer space={hp(1)} />
                <Text>{"To disable two-factor authentication, enter 2FA code below"}</Text>
                <Spacer space={hp(0.5)}></Spacer>
                <Input
                    value={code}
                    onChange={setCode}
                    placeholder={'Code'}
                    placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                    style={{ flex: 1, paddingBottom: wp(2) }}
                    mainstyle={{ flexDirection: 'row' }}
                />
                <Spacer space={hp(3.5)} />
                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => { onDisableOTP() }}>
                    <Text style={{ fontFamily: fonts.BOLD }}>{"Disable"}</Text>
                </TouchableOpacity>
            </SubContainer>
        </GlobalFlex>
    );
};
