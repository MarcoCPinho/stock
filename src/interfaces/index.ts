export interface IPricingData {
  [k: string]: any;
  change?: number;
  changePercent?: number;
  dayVolume?: number;
  currency?: string;
  id?: string;
  price?: number;
  time?: number;
}
