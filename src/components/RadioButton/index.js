/**
    * @description      : 
    * @author           : 
    * @group            : 
    * @created          : 14/07/2021 - 17:14:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 14/07/2021
    * - Author          : 
    * - Modification    : 
**/
import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { styles } from "./style";
import { colors } from '../../res/colors';

export const RadioButton = (props) => {
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7} onPress={props.handle_change}>
            <View style={[styles.radioCircle, props.value && { borderColor: colors.GREEN }]} >
                {props.value && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.lblsettigsub}>
                {props.text}
            </Text>
        </TouchableOpacity>
    )
}