import React, { useEffect, useState, useCallback } from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Order {
  id: string;
  status: 'pendente' | 'concluido';
  product_id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
  extras: Extra[];
  formattedTotal?: string;
  total: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { navigate } = useNavigation();

  const loadOrders = useCallback(async () => {
    const { data } = await api.get<Order[]>('/orders');

    if (data)
      setOrders(
        data.map(order => ({
          ...order,
          formattedTotal: formatValue(order.total),
        })),
      );
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  const handleNavigateOrderDetails = useCallback(
    (id: string | number) => {
      navigate('OrderDetails', { id });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              key={item.id}
              activeOpacity={0.6}
              onPress={() => handleNavigateOrderDetails(item.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedTotal}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
