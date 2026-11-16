export function createTransactionReference(): string {
  const randomPart = crypto.randomUUID().split('-')[0].toUpperCase();
  return `TXN-${randomPart}`;
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}
