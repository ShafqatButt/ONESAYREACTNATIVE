//#region import
//#region RN
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
//#endregion
//#region common files
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';
//#endregion
//#region third party libs
import CountryPicker from 'react-native-country-picker-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Icons from "react-native-heroicons/solid";
import { TextInput } from '../Input/style';
import styled from 'styled-components/native';
//#endregion
//#endregion

export const PhoneTextInput = (props) => {
    return (
        !props.withFlag ?
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.country_txt_bottom}>{"COUNTRY"} </Text>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1.5, borderBottomColor: colors.LIGHT_GRAY, alignItems: 'center' }}>
                    <CountryPicker
                        withModal={true}
                        withCallingCode={true}
                        withCallingCodeButton={true}
                        withFlag={true}
                        countryCode={props.cca2}
                        withFilter={true}
                        withCurrencyButton={false}
                        withFlagButton={false}
                        onSelect={(value) => props.selectCountry(value)}
                        theme={{ fontFamily: fonts.REGULAR, fontSize: wp(4.5), onBackgroundTextColor: colors.DARK_GRAY }}
                        containerButtonStyle={{ marginTop: 0, width: wp(18), zIndex: 1, marginBottom: -10 }}
                        excludeCountries={['AQ', 'HM', 'TF', 'UM', 'BV']} />
                    <View style={{ marginTop: wp(4) }}>
                        <Icons.ChevronDownIcon color={colors.HAWKES_BLUE} size={wp(4)} />
                    </View>
                </View>
                <InputWrapper style={[props.mainstyle]}>
                    <TextInput
                        value={props.value}
                        onChangeText={(value) => props.onChange(value)}
                        style={[props.style]}
                        keyboardType={props.keyboardType ? props.keyboardType : "default"}
                        returnKeyType={props.returnKeyType ? props.returnKeyType : 'default'}
                        placeholder={props.placeholder}
                        placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                    />
                </InputWrapper>
            </View> :
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                    withModal={true}
                    withCallingCode={true}
                    withCallingCodeButton={false}
                    withFlag={true}
                    countryCode={props.cca2}
                    withFilter={true}
                    withCurrencyButton={false}
                    withFlagButton={true}
                    isProfile={props.isProfile}
                    onSelect={(value) => props.selectCountry(value)}
                    theme={{ fontFamily: fonts.VR, fontSize: wp('5.2%'), itemHeight: wp('13%'), onBackgroundTextColor: colors.DARK }}
                    // theme={{ fontFamily: fonts.VR, fontSize: wp('5.4%'), itemHeight: wp('13%'), onBackgroundTextColor: colors.DARK }}
                    containerButtonStyle={{ marginTop: 0 }}
                    excludeCountries={['AQ', 'HM', 'TF', 'UM', 'BV']} />
            </View>
    )
}

const InputWrapper = styled.View`
    width: ${wp(88)};
    alignSelf: center;
    marginLeft: ${wp(2)}px;
    borderColor: ${colors.LIGHT_GRAY};
    borderBottomWidth: 1.5px`;


export {
    InputWrapper,

}

const styles = StyleSheet.create({
    phoneInput: {
        width: wp(65),
        padding: wp(5),
        fontSize: wp(4.5),
        color: colors.BLACK,
        paddingLeft: 0,
        borderBottomWidth: 1.5,
        marginLeft: wp('4%'),
        paddingBottom: wp(2),
        borderBottomColor: colors.LIGHT_GRAY
    },
    phoneInputTxt: {
        fontSize: wp(4.5),
        fontFamily: fonts.REGULAR,
        color: colors.REGULAR_TEXT_COLOR
    },
    img: {
        height: hp('1%'),
        width: hp('1%'),
        marginLeft: wp('2%'),
    },
    country_txt_bottom: {
        fontSize: wp(3),
        fontFamily: fonts.REGULAR,
        position: 'absolute',
        color: colors.TRIPLET_PLACEHOLDER,
        // marginVertical: wp()
        top: -5
    }
})
