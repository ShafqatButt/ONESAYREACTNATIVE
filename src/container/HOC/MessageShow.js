import React, {Component} from 'react';
import Snackbar from 'react-native-snackbar';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';

export default class BaseClass extends Component {
  constructor(props) {
    super(props);
  }

  // dismissSnackBar() {
  //   // console.log('IN DISSMISS');
  //   Snackbar.dismiss();
  // }
  showToast(title) {
    Snackbar.show({
      text: title,
      textColor: colors.WHITE,
      backgroundColor: colors.PRIMARY_COLOR,
      duration: Snackbar.LENGTH_LONG,
      action: {
        textColor: '#FFF',
        onPress: () => {
          /* Do something. */
        },
      },
    });
  }

  showToastSucess(title) {
    Snackbar.show({
      text: title,
      fontFamily: fonts.REGULAR,
      textColor: colors.DARK_GREEN,
      backgroundColor: colors.LIGHT_GREEN,
      duration: Snackbar.LENGTH_LONG,
      action: {
        textColor: colors.DARK_GREEN,
        onPress: () => {
          /* Do something. */
        },
      },
    });
  }

  showToastAlert(Message) {
    Snackbar.show({
      text: Message,
      fontFamily: fonts.REGULAR,
      textColor: colors.WHITE,
      backgroundColor: colors.DARK_RED,
      duration: Snackbar.LENGTH_SHORT,
      action: {
        textColor: colors.WHITE,
        onPress: () => {},
      },
    });
    // alert(Message)
  }

  showToastAlertWithCall(Message, onPressCall) {
    Snackbar.show({
      text: Message,
      fontFamily: fonts.REGULAR,
      textColor: colors.WHITE,
      backgroundColor: colors.DARK_RED,
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        text: 'Ok',
        textColor: colors.WHITE,
        onPress: () => {
          onPressCall();
        },
      },
    });
    // alert(Message)
  }
}
