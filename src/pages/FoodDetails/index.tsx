import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';

import { Image } from 'react-native';
import { v4 as uuid } from 'uuid';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import numberUtils from '../../utils/number';
import formatValue from '../../utils/formatValue';
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
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
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
  quantity: number;
  total: number;
  thumbnail_url: string;
}

type Favorite = Omit<Food, 'extras'>;

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const loadFood = async (): Promise<void> => {
      const { data } = await api.get<Food>(`/foods/${routeParams.id}`);

      if (data) {
        setFood({
          ...data,
          formattedPrice: numberUtils.currency.currencyFormatterPTBR(
            data.price,
          ),
        });
        setExtras(
          data.extras.map((extra: Omit<Extra, 'quantity'>) => ({
            ...extra,
            quantity: 0,
          })),
        );
      }
    };
    loadFood();
  }, [routeParams]);

  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const { data } = await api.get<Favorite>(`/favorites/${food.id}`);

        if (data?.id) setIsFavorite(true);
      } catch (err) {}
    };
    loadFavorites();
  }, [food]);

  const handleIncrementExtra = useCallback(
    (id: number): void => {
      setExtras(
        extras.map(extra =>
          extra.id === id ? { ...extra, quantity: extra.quantity + 1 } : extra,
        ),
      );
    },
    [extras],
  );

  const handleDecrementExtra = useCallback(
    (id: number): void => {
      const extraExists = extras.find(extra => extra.id === id);

      if (extraExists?.quantity === 0) return;

      setExtras(
        extras.map(extra =>
          extra.id === id ? { ...extra, quantity: extra.quantity - 1 } : extra,
        ),
      );
    },
    [extras],
  );

  const handleIncrementFood = useCallback(() => {
    setFoodQuantity(foodQuantity + 1);
  }, [foodQuantity]);

  const handleDecrementFood = useCallback(() => {
    if (foodQuantity > 1) setFoodQuantity(foodQuantity - 1);
  }, [foodQuantity]);

  const toggleFavorite = useCallback(() => {
    const { extras: extrasRemove, formattedPrice, ...foodSave } = food;

    if (isFavorite) {
      api.delete(`/favorites/${foodSave.id}`);
    } else {
      api.post(`/favorites`, foodSave);
    }
    setIsFavorite(!isFavorite);
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    if (!food.price) return '0,00';
    let valueExtra = 0.0;

    if (extras.length)
      valueExtra = extras
        .map(extra => extra.value * extra.quantity)
        .reduce(
          (iterator: number, currentValue: number): number =>
            (iterator += currentValue),
          0,
        );

    if (!Number(valueExtra)) valueExtra = 0.0;

    const value = (Number(food.price) + Number(valueExtra)) * foodQuantity;

    return formatValue(value);
  }, [extras, food, foodQuantity]);

  const handleFinishOrder = useCallback(async () => {
    const extrasSelecionados = extras.filter(extra => extra.quantity > 0);
    const order: Order = {
      id: uuid(),
      quantity: foodQuantity,
      product_id: food.id,
      description: food.description,
      extras: extrasSelecionados,
      thumbnail_url: food.image_url,
      image_url: food.image_url,
      name: food.name,
      price: food.price,
      total: numberUtils.currency.currencyBRLToDouble(cartTotal),
    };

    await api.post('/orders', order);
    navigation.navigate('ConfirmOrder');
  }, [food, extras, cartTotal, navigation, foodQuantity]);

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

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
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdittionalItemText testID="food-quantity">
                {foodQuantity}
              </AdittionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
