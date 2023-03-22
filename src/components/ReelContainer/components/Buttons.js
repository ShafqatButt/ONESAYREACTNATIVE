import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';



function Buttons({
  customComponent,
  name = 'like2',
  text = 'Like',
  color = 'white',
  size = 30,
  onPress,
  pressStyle,
  isFontAwesome,
  isFontIonic
}) {
  return (
    <Pressable style={[styles.container]} onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>

            {
              isFontAwesome ?
                <View style={pressStyle}>
                  <FontAwesome name={name} color={color} size={size} />
                </View>
                :
                isFontIonic ?
                  <View style={pressStyle}>
                    <Ionicons name={name} color={color} size={size} />
                  </View>
                  :
                  <View style={pressStyle}>
                    <AntDesign name={name} color={color} size={size} />
                  </View>
            }

            <Text style={{ marginTop: 10, fontWeight: 'bold', color: 'white' }}>
              {text}
            </Text>
          </View>
        )}
    </Pressable>
  );
}

export default Buttons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 5,
  },
});
