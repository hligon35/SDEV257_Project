import { handleError, assertIsError } from '../src/errors/handler';

test('handleError returns object with message', () => {
  const out = handleError(new Error('boom'));
  expect(out).toHaveProperty('ok', false);
  expect(out).toHaveProperty('message', 'boom');
});

test('assertIsError recognizes error-like objects', () => {
  expect(assertIsError({ message: 'hi' })).toBe(true);
  expect(assertIsError({})).toBe(false);
});
