export function handleError(err) {
  if (err && err.message) return { ok: false, message: err.message };
  return { ok: false, message: String(err) };
}

export function assertIsError(obj) {
  return obj && typeof obj === 'object' && typeof obj.message === 'string';
}
