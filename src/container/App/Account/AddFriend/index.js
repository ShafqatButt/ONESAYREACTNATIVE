import React, { useContext, useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import { GlobalFlex } from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { colors } from '../../../../res/colors';
import { images } from '../../../../res/images';
import { styles } from './style';
import { AuthContext } from '../../../../context/Auth.context';
import realm from '../../../../realmStore';
// Third Party library
import AlphabetList from 'react-native-flatlist-alphabet';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


export default AddFriend = props => {
    const refContactsData = React.useRef([
        ...realm.objects('Contact').sorted('givenName'),
    ]);
    const [mathRandom, setMathRandom] = useState(Math.random());
    const [selectedContact, setSelectedContacts] = useState([]);
    const { state: ContextState, logout } = useContext(AuthContext);
    const { userData } = ContextState;
    const [search, setSearchQuery] = useState('');
    const [contactData, setContactData] = useState(refContactsData?.current);

    const getUserContactList = () => {
        let arr = [];
        const _contact = JSON.parse(
            JSON.stringify(realm.objects('Contact').sorted('givenName')),
        );

        _contact.map(item => {
            arr.push({
                key: item.key,
                value: item.value,
                is_checked: false,
                recordID: item.recordID,
                givenName: item.givenName,
                familyName: item.familyName,
                phoneNumber: item.phoneNumber,
                hasThumbnail: item.hasThumbnail,
                thumbnailPath: item.thumbnailPath,
            });
        });
        setContactData(arr);
        return () => {
            selectedPhones = [];
        };
    };

    useEffect(() => {
        getUserContactList();
    }, []);

    const renderListItem = item => {
        return (
            <TouchableOpacity
                key={mathRandom}
                style={styles.listItemContainer}
            >
                <Image
                    source={item.hasThumbnail ? { uri: item.thumbnailPath } : images.avatar}
                    style={{ width: wp(8), height: wp(8), borderRadius: wp(8) }}
                />
                <Text style={styles.listItemLabel}>{item.value}</Text>
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = section => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
            </View>
        );
    };

    return (
        <GlobalFlex>
            <BackHeader
                is_center_text
                title={'Add Friend'}
                onBackPress={() => props.navigation.goBack()}
                isRightText={false}
            />
            <Spacer space={hp(1)} />
            <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
                {contactData && contactData.length > 0 && mathRandom && (
                    <>
                        <AlphabetList
                            style={{ flex: 1 }}
                            data={contactData}
                            renderItem={renderListItem}
                            renderSectionHeader={renderSectionHeader}
                            letterItemStyle={{ height: 0 }}
                            indexLetterColor={colors.PRIMARY_COLOR}
                        />
                        <Spacer space={hp(1)} />
                    </>
                )}
            </View>

        </GlobalFlex>
    );
};
