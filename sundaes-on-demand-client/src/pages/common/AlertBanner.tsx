import React from 'react';
import { Alert } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';

interface Props {
  message?: string;
  variant?: Variant;
}

export default function AlertBanner({ message, variant }: Props) {
  const alertMessage =
    message || 'An unexpected error occurred. Please try again later.';
  const alertVariant = variant || 'danger';

  return (
    <Alert variant={alertVariant} style={{ backgroundColor: 'red' }}>
      {alertMessage}
    </Alert>
  );
}
