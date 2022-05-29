import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import './App.css';

import { OrderDetailsProvider } from '@app/contexts/OrderDetails';
import OrderConfirmation from '@app/pages/confirmation/OrderConfirmation';
import OrderEntry from '@app/pages/entry/OrderEntry';
import OrderSummary from '@app/pages/summary/OrderSummary';
import { OrderPhase } from '@app/types/order';

function App() {
  // orderPhase needs to be 'inProgress', 'review' or 'completed'
  const [orderPhase, setOrderPhase] = useState<OrderPhase>('inProgress');

  let Component = OrderEntry; // default to order page
  switch (orderPhase) {
    case 'inProgress':
      Component = OrderEntry;
      break;
    case 'review':
      Component = OrderSummary;
      break;
    case 'completed':
      Component = OrderConfirmation;
      break;
    default:
  }

  return (
    <OrderDetailsProvider>
      <Container>{<Component setOrderPhase={setOrderPhase} />}</Container>
    </OrderDetailsProvider>
  );
}

export default App;
