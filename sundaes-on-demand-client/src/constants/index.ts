import { OptionType } from '@app/types/options';

export const pricePerItem: { [key in OptionType]: number } = {
  scoops: 2,
  toppings: 1.5,
};
