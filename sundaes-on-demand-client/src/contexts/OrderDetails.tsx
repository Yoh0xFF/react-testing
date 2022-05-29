import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { pricePerItem } from '@app/constants';
import { OptionType } from '@app/types/options';
import { formatCurrency } from '@app/utilities';

type OptionCount = {
  scoops: Map<string, number>;
  toppings: Map<string, number>;
  totals: {
    scoops?: string;
    toppings?: string;
    grandTotal?: string;
  };
};

type OrderDetailsContext = [
  OptionCount,
  (itemName: string, newItemCount: number, optionType: OptionType) => void,
  () => void
];

const OrderDetails = createContext<OrderDetailsContext>([
  {
    scoops: new Map<string, number>(),
    toppings: new Map<string, number>(),
    totals: {},
  },
  (itemName, newItemCount, optionType) => {},
  () => {},
]);

// create custom hook to check whether we're inside a provider
export function useOrderDetails(): OrderDetailsContext {
  const context = useContext(OrderDetails);

  if (!context) {
    throw new Error(
      'useOrderDetails must be used within an OrderDetailsProvider'
    );
  }

  return context;
}

function calculateSubtotal(
  optionType: OptionType,
  optionCounts: { [key in OptionType]: Map<string, number> }
): number {
  let optionCount = 0;

  for (const count of Array.from(optionCounts[optionType].values())) {
    optionCount += count;
  }

  return optionCount * pricePerItem[optionType];
}

interface Props {}

export function OrderDetailsProvider(props: Props) {
  const zeroCurrency = formatCurrency(0);

  const [optionCounts, setOptionCounts] = useState<{
    [key in OptionType]: Map<string, number>;
  }>({
    scoops: new Map<string, number>(),
    toppings: new Map<string, number>(),
  });

  const [totals, setTotals] = useState<{
    [key in OptionType | 'grandTotal']: string;
  }>({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency,
  });

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal('scoops', optionCounts);
    const toppingsSubtotal = calculateSubtotal('toppings', optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;

    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  const value: OrderDetailsContext = useMemo(() => {
    function updateItemCount(
      itemName: string,
      newItemCount: number,
      optionType: OptionType
    ) {
      const newOptionCounts = { ...optionCounts };

      // update option count for this item with the new value
      const optionCountsMap = optionCounts[optionType];
      optionCountsMap.set(itemName, newItemCount);

      setOptionCounts(newOptionCounts);
    }

    function resetOrder() {
      setOptionCounts({
        scoops: new Map<string, number>(),
        toppings: new Map<string, number>(),
      });
    }

    // getter: object containing option counts for scoops and toppings, subtotals and totals
    // setter: updateOptionCount
    return [{ ...optionCounts, totals }, updateItemCount, resetOrder];
  }, [optionCounts, totals]);

  return <OrderDetails.Provider value={value} {...props} />;
}
