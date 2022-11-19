import { IPricingData } from '../../interfaces';
import { formatNumber } from '../../utils';

export const formatObjectSearch = (data: IPricingData[]): Object[] => {
  let formatedData: Object[] = [];

  if (data) {
    const formatedContent = data.map((obj: IPricingData) => ({
      id: obj.id,
      price: formatNumber(2, 'currency', obj.price!, obj.currency!),
      change: obj.change,
      changePercent: formatNumber(4, 'percent', obj.changePercent!),
      dayVolume: obj.dayVolume,
      time: new Date(new Date().setTime(obj.time!)).toUTCString(),
      obj: { ...obj },
    }));
    formatedData = [...formatedContent];
  }

  return formatedData;
};
