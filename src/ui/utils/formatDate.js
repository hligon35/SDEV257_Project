export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString();
}
