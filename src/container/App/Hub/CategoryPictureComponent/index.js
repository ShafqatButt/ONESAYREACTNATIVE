import React from 'react';
import { images } from '../../../../res/images'
import styles, {
  Container,
  ButtonIcon,
  CategoryPhoto,
  ButtonContainer,
  ButtonContainerAbsolute,
} from './styles';

const CategoryPictureComponent = props => {
  const { onPressed, source, withBorder = false } = props;
  return (
    <Container withBorder={withBorder}>
      <CategoryPhoto
        resizeMode={'cover'}
        withBorder={withBorder}
        defaultSource={images.bg_gray}
        source={source}
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

export default CategoryPictureComponent;
