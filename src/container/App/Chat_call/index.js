import React, { useContext, useState, useEffect } from 'react';
import { View, PermissionsAndroid, Platform } from 'react-native';
// style themes and components
import { GlobalFlex } from '../../../res/globalStyles';
// Third Party library
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ActionWrapper, BorderContainer, styles, Text } from './style';
import { fonts } from '../../../res/fonts';
// import Realm from "realm";
import realm from '../../../realmStore';
import Contacts from 'react-native-contacts';

export default Chat_call = (props) => {

    useEffect(() => {

        if (Platform.OS == "android") {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.',
                    'buttonPositive': 'Please accept bare mortal'
                }
            )
                .then(Contacts.getAll()
                    .then(contacts => {
                        contacts.forEach(contact => {
                            realm.write(() => {
                                realm.create("Contact", {
                                    recordID: contact?.recordID,
                                    thumbnailPath: contact?.thumbnailPath,
                                    givenName: contact?.givenName,
                                    familyName: contact?.familyName,
                                    value: contact?.givenName + ' ' + contact?.familyName,
                                    key: contact?.givenName.substring(0, 1).toUpperCase() + contact?.familyName.substring(0, 1).toUpperCase(),
                                    hasThumbnail: contact?.hasThumbnail,
                                    phoneNumber: contact?.phoneNumbers[0].number
                                }, "modified");
                            });
                        })
                    }).then(() => console.log("Contacts synced!"))
                )
        } else {
            Contacts.getAll()
                .then(contacts => {
                    contacts.forEach(contact => {
                        realm.write(() => {
                            realm.create("Contact", {
                                recordID: contact.recordID,
                                thumbnailPath: contact.thumbnailPath,
                                givenName: contact.givenName,
                                familyName: contact.familyName,
                                value: contact.givenName + ' ' + contact.familyName,
                                key: contact.givenName.substring(0, 1).toUpperCase() + contact.familyName.substring(0, 1).toUpperCase(),
                                hasThumbnail: contact.hasThumbnail,
                                phoneNumber: contact.phoneNumbers[0].number
                            }, "modified");
                        });
                    })
                }).then(() => console.log("Contacts synced!"));

            Contacts.checkPermission()
        }
    }, [])

    return (
        <GlobalFlex>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActionWrapper onPress={() => { props.navigation.navigate('Contacts') }} >
                    <Text style={[{ textAlign: 'center', width: wp(100), alignSelf: "center", fontFamily: fonts.REGULAR }]}>Buzzmi Call</Text>
                </ActionWrapper>
            </View>
        </GlobalFlex>
    );
}
