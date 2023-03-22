import React, { useContext, useState, useEffect } from 'react';
import { Switch, View, TouchableOpacity, Image } from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import { GlobalFlex } from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { colors } from '../../../../res/colors';
// Third Party library
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ActionWrapper, HeaderShadowLine, BorderContainer, styles, Text } from './style';
import { fonts } from '../../../../res/fonts';
import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';
import { saveData } from '../../../../res/asyncStorageHelper';

export default ChatFontSetting = props => {
    const [gfontSize, setFontsSize] = useState(global.fontSize);
    const { openSheet } = useBottomSheet()

    const onBottomSheetActions = () => {
        let menuToShow = [];

        menuToShow.push({
            title: <Text style={{ color: global.fontSize == 's' ? colors.PRIMARY_COLOR : colors.BLACK, textAlign: 'center', width: wp(100) }}>{"Small"}</Text>,
            onPress: async () => {
                global.fontSize = 's'
                setFontsSize(global.fontSize)
                saveData("fontSize", 's', (success) => { console.log(success) }, (error) => { console.log(error) })
            }
        });

        menuToShow.push({
            title: <Text style={{ color: global.fontSize == 'm' ? colors.PRIMARY_COLOR : colors.BLACK, textAlign: 'center', width: wp(100) }}>{"Medium"}</Text>,
            onPress: async () => {
                global.fontSize = 'm'
                setFontsSize(global.fontSize)
                saveData("fontSize", 'm', (success) => { console.log(success) }, (error) => { console.log(error) })
            }
        });

        menuToShow.push({
            title: <Text style={{ color: global.fontSize == 'l' ? colors.PRIMARY_COLOR : colors.BLACK, textAlign: 'center', width: wp(100) }}>{"Large"}</Text>,
            onPress: async () => {
                global.fontSize = 'l'
                setFontsSize(global.fontSize)
                saveData("fontSize", 'l', (success) => { console.log(success) }, (error) => { console.log(error) })
            }
        });

        openSheet({ sheetItems: menuToShow });
    }


    return (
        <GlobalFlex>
            <BackHeader
                onBackPress={() => { props.navigation.goBack() }}
                is_center_text
                title={'Chats'}
            />
            <Spacer space={wp(1.5)} />
            <HeaderShadowLine />

            <TouchableOpacity style={{ flexDirection: "row", padding: wp(5) }} onPress={() => { onBottomSheetActions() }}>
                <View>
                    <Text style={{ marginLeft: wp(4), fontFamily: fonts.REGULAR, textAlign: "left" }}>{"Font size"}</Text>
                    <Text style={{ marginLeft: wp(4), fontFamily: fonts.REGULAR, textAlign: "left", fontSize: wp(3), color: colors.DARK_GRAY_91, marginTop: wp(1) }}>{(global.fontSize == 's') ? "Small" : global.fontSize == 'm' ? "Medium" : "Large"}</Text>
                </View>
            </TouchableOpacity>

            <HeaderShadowLine light />

        </GlobalFlex>
    );
};
