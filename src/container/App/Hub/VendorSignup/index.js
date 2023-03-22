import React, { useContext, useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import { GlobalFlex, MainTitle, SubContainer } from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { POST } from '../../../../api_helper/ApiServices';
import { styles, Text } from './style';
import { AuthContext } from '../../../../context/Auth.context';
import { colors } from '../../../../res/colors';
import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { VENDOR } from '../../../../api_helper/Api';
import { Input } from '../../../../components/Input';
import { Button } from '../../../../components/Button';
import { getLanguageValueFromKey } from '../../../../commonAction';
// Third Party library
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import { Toast, useToast } from '@sendbird/uikit-react-native-foundation';
import { saveData } from '../../../../res/asyncStorageHelper';


export default VendorSignup = (props) => {

    const { state: ContextState, logout } = useContext(AuthContext);
    const { userData } = ContextState;
    const [email, setEmail] = useState(userData?.email || '');
    const [companyName, setCompanyName] = useState('');
    const { navigation, params } = useAppNavigation();
    const [isLoad, setIsLoad] = useState(false);
    const toast = useToast();

    const onSubmit = async () => {
        const uniqueID = await DeviceInfo.getUniqueId();
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email === '') {
            toast.show(getLanguageValueFromKey('please_enter_email'));
        } else if (!emailReg.test(email)) {
            toast.show(getLanguageValueFromKey('please_enter_valid_email'));
        } else if (companyName === '') {
            toast.show("please enter company name");
        } else {
            setIsLoad(true)
            let postData = {
                "email": email,
                "company": companyName
            }
            POST(VENDOR, true, userData.token, uniqueID, postData, async (data) => {
                setIsLoad(false)
                if (data?.company_id) {
                    saveData('company_id', data?.company_id);
                    navigation.pop()
                    setTimeout(() => {
                        navigation.navigate("AddCategory", { is_edit: false })
                    }, 150);
                } else {
                    toast.show(data)
                }
            })
        }
    }
    
    return (
        <GlobalFlex>
            <>
                <BackHeader textColor={{ color: colors.DARK_GRAY }}
                    isRightText={false}
                    onBackPress={() => { props.navigation.goBack() }}
                    is_center_text title={"Vendor Signup"} />
                <Spacer space={hp(0.6)} />
                <View style={styles.borderView} />
            </>
            <SubContainer>
                <Spacer space={hp(1)} />
                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    <Input
                        value={email}
                        onChange={setEmail}
                        placeholder={'Email'}
                        style={{ paddingBottom: wp(2) }}
                        placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                    />

                    <Input
                        value={companyName}
                        onChange={setCompanyName}
                        placeholder={'Company Name'}
                        style={{ paddingBottom: wp(2) }}
                        placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                    />
                    <Spacer space={hp(1.5)} />
                    <Button
                        isLoading={isLoad}
                        buttonText={'Register'}
                        buttonPress={() => onSubmit()}
                    />
                </ScrollView>
                {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
            </SubContainer>

        </GlobalFlex>
    );
}

