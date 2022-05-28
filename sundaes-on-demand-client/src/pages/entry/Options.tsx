import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';

import { pricePerItem } from '@app/constants';
import { useOrderDetails } from '@app/contexts/OrderDetails';
import AlertBanner from '@app/pages/common/AlertBanner';
import ScoopOption from '@app/pages/entry/ScoopOption';
import ToppingOption from '@app/pages/entry/ToppingOption';
import { Item, OptionType } from '@app/types/options';
import { formatCurrency } from '@app/utilities';

interface Props {
  optionType: OptionType;
}

export default function Options({ optionType }: Props) {
  const [items, setItems] = useState<Array<Item>>([]);
  const [error, setError] = useState<boolean>(false);
  const [orderDetails, updateItemCount] = useOrderDetails();

  // optionType is 'scoops' or 'toppings'
  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => setError(true));
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      updateItemCount={(itemName, newItemCount) =>
        updateItemCount(itemName, newItemCount, optionType)
      }
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {orderDetails.totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}
