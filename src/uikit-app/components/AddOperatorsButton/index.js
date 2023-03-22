import React from 'react';
import IconAssets from '../../../assets';
import {Button, Icon, Title} from './styles';
import Strings from "../../../string_key/Strings";

const AddOperatorsButton = props => {
  const {identifier = Strings.operator} = props;
  const getStringForValue = val => {
    if (val.toLowerCase().includes('opera')) {
      return Strings.operator;
    } else if (val.toLowerCase().includes('admi')) {
      return Strings.admin;
    }

    return val;
  };

  return (
    <Button onPress={props.onPress}>
      <Icon source={IconAssets.ic_add_operator} />
      <Title>{Strings.add} {getStringForValue(identifier)}s</Title>
    </Button>
  );
};

export default AddOperatorsButton;
