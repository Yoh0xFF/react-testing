import React, { FormEvent, useState } from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';

import { OrderPhase } from '@app/types/order';

interface Props {
  setOrderPhase?: (orderPhase: OrderPhase) => void;
}

export default function SummaryForm({ setOrderPhase }: Props) {
  const [tcChecked, setTcChecked] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // pass along to the next phase.
    // The next page will handle submitting order from context.
    setOrderPhase && setOrderPhase('completed');
  }

  const popover = (
    <Popover id='termsandconditions-popover'>
      <Popover.Body>No ice cream will actually be delivered</Popover.Body>
    </Popover>
  );

  const checkboxLabel = (
    <span>
      I agree to
      <OverlayTrigger placement='right' overlay={popover}>
        <span style={{ color: 'blue' }}> Terms and Conditions</span>
      </OverlayTrigger>
    </span>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='terms-and-conditions'>
        <Form.Check
          type='checkbox'
          checked={tcChecked}
          onChange={(e) => setTcChecked(e.target.checked)}
          label={checkboxLabel}
        />
      </Form.Group>

      <Button variant='primary' type='submit' disabled={!tcChecked}>
        Confirm order
      </Button>
    </Form>
  );
}
