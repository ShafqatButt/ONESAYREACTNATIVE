import React from 'react';
import {images} from '../../../../../res/images';
import styles, {
  Container,
  ButtonIcon,
  ProfilePhoto,
  ButtonContainer,
  ButtonContainerAbsolute,
} from './styles';

const ProfilePictureComponent = props => {
  const {onPressed, source, withBorder = false} = props;
  return (
    <Container withBorder={withBorder}>
      <ProfilePhoto
        resizeMode={'cover'}
        withBorder={withBorder}
        defaultSource={images.avatar}
        source={typeof source !== 'number' ? {uri: source} : source}
      />
      {withBorder ? (
        <ButtonContainerAbsolute style={styles.shadowStyle} onPress={onPressed}>
          <ButtonIcon
            resizeMode={'contain'}
            withBorder={withBorder}
            source={images.ic_camera}
          />
        </ButtonContainerAbsolute>
      ) : (
        <ButtonContainer onPress={onPressed}>
          <ButtonIcon resizeMode={'contain'} source={images.ic_camera} />
        </ButtonContainer>
      )}
    </Container>
  );
};

export default ProfilePictureComponent;
