import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Message, Content, IconContainer } from './styles';

interface IconProps {
  name: string;
  size: number;
  color: string;
}

interface MessageFullScreenProps {
  message: string;
  isVisibility: boolean;

  icon?: IconProps;
}

const MessageFullScreen: React.FC<MessageFullScreenProps> = ({
  message,
  isVisibility,
  icon,
}) => {
  return (
    <Container
      visible={isVisibility}
      statusBarTranslucent
      transparent
      animationType="slide"
    >
      <Content>
        <IconContainer>
          {icon && (
            <Icon name={icon.name} size={icon.size} color={icon.color} />
          )}
        </IconContainer>
        <Message>{message}</Message>
      </Content>
    </Container>
  );
};

export default MessageFullScreen;
