import React, { FormEvent, useState } from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';

interface Props {
  setOrderPhase?: (orderPhase: string) => void;
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
      {/* note: for React Bootstrap 2.x, the previous line needs to be:
      <Popover.Body>No ice cream will actually be delivered</Popover.Body>
      (replace Popover.Content with Popover.Body). For more details, see
      https://www.udemy.com/course/react-testing-library/learn/lecture/30126784*/}
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
