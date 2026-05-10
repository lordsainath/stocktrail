export function generateMockCandleData(quote, count = 30) {
  const current = Number(quote.c);
  const high = Number(quote.h);
  const low = Number(quote.l);
  const open = Number(quote.o);

  if (!current || !high || !low || !open) {
    return {
      c: [],
      h: [],
      l: [],
      o: [],
      t: [],
      v: [],
      s: 'error',
    };
  }

  const range = high - low;

  const from = Date.now() - count * 15 * 60 * 1000;

  const to = Date.now();

  // Generate close prices
  const closePrices = Array.from({ length: count }, (_, i) => {
    // Smooth market trend
    const trend = Math.sin(i / 5) * (range * 0.3);

    // Random market volatility
    const noise = (Math.random() - 0.5) * (range * 0.15);

    let price = open + trend + noise;

    // Keep inside daily range
    price = Math.max(low, price);

    price = Math.min(high, price);

    return Number(price.toFixed(2));
  });

  // Final candle must match current live price
  closePrices[count - 1] = current;

  return {
    // Close prices
    c: closePrices,

    // High prices
    h: closePrices.map((price) => Number((price + Math.random() * 2).toFixed(2))),

    // Low prices
    l: closePrices.map((price) => Number((price - Math.random() * 2).toFixed(2))),

    // Open prices
    o: closePrices.map((price) => Number((price + (Math.random() - 0.5) * 2).toFixed(2))),

    // Time labels
    t: Array.from({ length: count }, (_, i) => from + (i * (to - from)) / count),

    // Volume data
    v: Array.from({ length: count }, () => Math.floor(Math.random() * 1000000)),

    // Status
    s: 'ok',
  };
}
