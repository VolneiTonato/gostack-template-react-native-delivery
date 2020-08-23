import styled from 'styled-components/native';
import { Modal } from 'react-native';

export const Container = styled(Modal)``;

export const Content = styled.View`
  background: #000;
  opacity: 0.9;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Message = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 24px;
`;

export const IconContainer = styled.View`
  padding: 16px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
