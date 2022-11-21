import { IPricingData } from '../interfaces';

export const STOCKS = [
  'SPY',
  'TSLA',
  'APPL',
  'AMZN',
  'MSFT',
  'META',
  'GOOG',
  'AMD',
  'INTC',
  'NVDA',
];

export const INITIAL_STATE: IPricingData[] = STOCKS.map(stock => ({
  change: 0,
  changePercent: 0,
  dayVolume: 0,
  exchange: '',
  id: stock,
  marketHours: '',
  price: 0,
  priceHint: '',
  quoteType: '',
  time: 0,
}));
