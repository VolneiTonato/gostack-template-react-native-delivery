import React, { useEffect } from 'react';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Container, Message, IconContainer } from './styles';

const ConfirmOrder: React.FC = () => {
  const { reset } = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      reset({
        routes: [{ name: 'MainBottom' }],
        index: 0,
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [reset]);

  return (
    <Container>
      <IconContainer>
        <Icon name="thumbs-up" size={40} color="green" />
      </IconContainer>
      <Message>Pedido confirmado!</Message>
    </Container>
  );
};

export default ConfirmOrder;
