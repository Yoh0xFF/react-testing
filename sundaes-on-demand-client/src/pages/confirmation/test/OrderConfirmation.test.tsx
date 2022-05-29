import { rest } from 'msw';

import { server } from '@app/mocks/server';
import OrderConfirmation from '@app/pages/confirmation/OrderConfirmation';
import { render, screen } from '@app/test-utils/testing-library-utils';

test('error response from server for submitting order', async () => {
  // override default msw response for options endpoint with error response
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation setOrderPhase={() => {}} />);

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(
    'An unexpected error occurred. Please try again later.'
  );
});
