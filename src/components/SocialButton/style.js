// noinspection ES6CheckImport
import {Platform, StyleSheet} from 'react-native';
import styled from 'styled-components/native';

const ButtonContainer = styled.TouchableOpacity`
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
`;

const styles = StyleSheet.create({
  iconStyle: {height: 42, width: 42},
  shadowStyle: {
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
});

export {styles, ButtonContainer};
