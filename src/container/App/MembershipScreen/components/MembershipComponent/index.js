// noinspection ES6CheckImport

import React from 'react';
import styles, {
  Icon,
  TitleText,
  ColorLine,
  Container,
  IconContainer,
  DescriptionText,
} from './styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Spacer} from '../../../../../res/spacer';
import IconAssets from '../../../../../assets';

const MembershipComponent = props => {
  const {onPress, title, price, description, isSelected, index} = props;
  return (
    <Container onPress={onPress} style={styles.shadowStyle}>
      <Spacer space={wp('2%')} />
      <TitleText>
        {title} ({price}$)
      </TitleText>
      <Spacer space={wp('2%')} />
      <ColorLine style={{opacity: 0.2 * (index + 2)}} />
      <Spacer space={wp('2%')} />
      <DescriptionText>{description}</DescriptionText>
      <Spacer space={wp('2%')} />
      <IconContainer isSelected={isSelected}>
        <Icon source={IconAssets.ic_done} />
      </IconContainer>
    </Container>
  );
};

export default MembershipComponent;
