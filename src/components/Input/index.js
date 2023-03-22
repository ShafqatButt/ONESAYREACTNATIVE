import React, {useState, useRef} from 'react';
import {InputWrapper, ShowTouch, TextInput, ChevronWrapper} from './style';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Icons from 'react-native-heroicons/solid';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';

export const Input = React.forwardRef((props, ref) => {
  const refTextInput = useRef(null);
  const [isFocused, setFocused] = useState(false);
  React.useImperativeHandle(
    ref,
    () => ({
      setFocus: inFocus => {
        if (inFocus) {
          setTimeout(() => refTextInput?.current?.focus(), 700);
        }
        setFocused(() => inFocus);
      },
    }),
    [],
  );
  return (
    <>
      {props.is_clickable ? (
        <InputWrapper editable={props?.editable} style={[props.mainstyle]}>
          <TextInput
            ref={refTextInput}
            pointerEvents={'none'}
            autoCapitalize="none"
            value={props.value}
            onChangeText={value => props.onChange(value)}
            style={[props.style]}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            returnKeyType={
              props.returnKeyType ? props.returnKeyType : 'default'
            }
            placeholder={props.placeholder}
            secureTextEntry={props.secureTextEntry}
            placeholderTextColor={props.placeholderTextColor}
          />
          <ChevronWrapper>
            <Icons.ChevronDownIcon color={colors.DARK_GRAY} size={wp(4)} />
          </ChevronWrapper>
        </InputWrapper>
      ) : props.is_password ? (
        <InputWrapper editable={props?.editable} style={[props.mainstyle]}>
          <TextInput
            ref={refTextInput}
            autoCapitalize="none"
            value={props.value}
            onChangeText={value => props.onChange(value)}
            style={[props.style]}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            returnKeyType={
              props.returnKeyType ? props.returnKeyType : 'default'
            }
            placeholder={props.placeholder}
            secureTextEntry={props.secureTextEntry}
            placeholderTextColor={props.placeholderTextColor}
          />
          <ShowTouch onPress={() => props.onTouchPress()}>
            {props.secureTextEntry ? (
              <Icons.EyeSlashIcon color={colors.HAWKES_BLUE} size={wp(6)} />
            ) : (
              <Icons.EyeIcon color={colors.HAWKES_BLUE} size={wp(6)} />
            )}
          </ShowTouch>
        </InputWrapper>
      ) : (
        <InputWrapper
          editable={props?.editable}
          isFocused={isFocused}
          style={[props?.mainstyle]}>
          <TextInput
            ref={refTextInput}
            autoCapitalize="none"
            value={props.value}
            onChangeText={value => props.onChange(value)}
            style={[props.style]}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            returnKeyType={
              props.returnKeyType ? props.returnKeyType : 'default'
            }
            placeholderTextColor={props.placeholderTextColor}
            placeholder={props.placeholder}
            {...props}
          />
        </InputWrapper>
      )}
    </>
  );
});
