import React, { useEffect, useState, useMemo } from 'react';

import { Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import numberUtils from '../../utils/number';
import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPriceExtra,
  TotalPrice,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
  formattedPrice?: string;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
}

interface Order extends Omit<Food, 'id' | 'formattedPrice'> {
  id: number | string;
  product_id: number;
  thumbnail_url: string;
  formattedPrice?: string;
  total: number;
  formattedTotal?: string;
  quantity: number;
}

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState({} as Order);
  const [extras, setExtras] = useState<Extra[]>([]);

  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const loadOrder = async (): Promise<void> => {
      const { data } = await api.get<Order>(`/orders/${routeParams.id}`);

      if (data) {
        setOrder({
          ...data,
          formattedPrice: numberUtils.currency.currencyFormatterPTBR(
            data.price,
          ),
          formattedTotal: numberUtils.currency.currencyFormatterPTBR(
            data.total,
          ),
        });

        if (data.extras) {
          setExtras(
            data.extras.map(extra => ({
              ...extra,
              formattedPrice: numberUtils.currency.currencyFormatterPTBR(
                extra.quantity * extra.value,
              ),
            })),
          );
        }
      }
    };
    loadOrder();
  }, [routeParams]);

  const totalItem = useMemo(() => {
    return numberUtils.currency.currencyFormatterPTBR(
      order.price * order.quantity,
    );
  }, [order]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: order.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{order.name}</FoodTitle>
              <FoodDescription>{order.description}</FoodDescription>
              <FoodPricing>{order.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Item Principal</Title>
          <AdittionalItem>
            <AdittionalItemText>{order.name}</AdittionalItemText>
            <AdittionalQuantity>
              <AdittionalItemText>{order.quantity}</AdittionalItemText>
              <TotalPriceExtra>{totalItem}</TotalPriceExtra>
            </AdittionalQuantity>
          </AdittionalItem>
        </AdditionalsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <TotalPriceExtra>{extra.formattedPrice}</TotalPriceExtra>
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice>{order.formattedTotal}</TotalPrice>
          </PriceButtonContainer>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default OrderDetails;
