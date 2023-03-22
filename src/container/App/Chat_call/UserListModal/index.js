import React from 'react';
import {images} from '../../../../res/images';
import styles, {
  NameText,
  TitleText,
  UnderLine,
  ProfileImage,
  ItemContainer,
  MainContainer,
} from './style';
import { Spacer } from "../../../../res/spacer";

export default UserListModal = props => {
  const {users, title} = props.route.params;
  return (
    <MainContainer>
      <TitleText>{title}</TitleText>
      <Spacer top={10} />
      <UnderLine />
      <Spacer top={10} />
      {users.map(user => (
        <>
          <ItemContainer>
            <ProfileImage
              source={
                user?.plainProfileUrl?.length > 0
                  ? {uri: user?.plainProfileUrl}
                  : images.avatar
              }
            />
            <NameText>{user.nickname}</NameText>
          </ItemContainer>
          <UnderLine marginAtStart />
        </>
      ))}
    </MainContainer>
  );
};
