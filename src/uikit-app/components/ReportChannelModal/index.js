// noinspection ES6CheckImport

import React, {useState, useEffect} from 'react';
import {Modal} from 'react-native';
import {
  Icon,
  Flex,
  Title,
  Button,
  Message,
  CheckBox,
  Container,
  MainContainer,
  ButtonContainer,
} from './styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {getLanguageValueFromKey} from '../../../commonAction';
import {Spacer} from '../../../res/spacer';
import IconAssets from '../../../assets';
import Strings from '../../../string_key/Strings';

const ReportChannelModal = props => {
  const {onHideModal, onReport, identifier} = props;
  const [isSelected, setSelected] = useState(false);

  /**
   * Reset the modal...
   */
  useEffect(() => {
    if (!props.visible) {
      setSelected(() => false);
    }
  }, [props.visible]);

  const getStringForValue = val => {
    if (val.toLowerCase().includes('opera')) {
      return Strings.operator;
    } else if (val.toLowerCase().includes('admi')) {
      return Strings.admin;
    } else if (val.toLowerCase().includes('chann')) {
      return Strings.channel;
    } else if (val.toLowerCase().includes('grou')) {
      return Strings.group;
    }

    return val;
  };

  return (
    <Modal {...props}>
      <MainContainer>
        <Container>
          <Title>
            {Strings.report_this} {getStringForValue(identifier)} Buzzmi?
          </Title>
          <Spacer top={wp('4%')} />
          <Message>
            {identifier === 'Group'
              ? Strings.msg_report_group
              : Strings.msg_report_channel}
          </Message>

          <Spacer top={wp('4%')} />
          <Message>
            {Strings.no_one_in_the}{' '}
            {getStringForValue(identifier).toLowerCase()}{' '}
            {Strings.will_be_notified}
          </Message>

          <Spacer top={wp('4%')} />
          <CheckBox onPress={() => setSelected(prevState => !prevState)}>
            <Icon
              source={
                isSelected
                  ? IconAssets.ic_checkbox_filled
                  : IconAssets.ic_checkbox_unfilled
              }
            />

            <Message>
              {Strings.exit_something}{' '}
              {getStringForValue(identifier).toLowerCase()}{' '}
              {Strings.and_delete_chat}
            </Message>
          </CheckBox>

          <Flex />
          <ButtonContainer>
            <Button suppressHighlighting onPress={onHideModal}>
              {Strings.Cancel}
            </Button>
            <Button suppressHighlighting onPress={() => onReport(isSelected)}>
              {Strings.report}
            </Button>
          </ButtonContainer>
        </Container>
      </MainContainer>
    </Modal>
  );
};

export default ReportChannelModal;
