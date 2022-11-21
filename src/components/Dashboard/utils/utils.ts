import { IPricingData } from '../../../interfaces';
import { formatNumber } from '../../../utils';

export const formatObjectSearch = (data: IPricingData[]): Object[] => {
  let formatedData: Object[] = [];

  if (data) {
    const formatedContent = data.map((obj: IPricingData) => ({
      id: obj.id,
      price: formatNumber(2, obj.price, 'USD', 'currency'),
      change: formatNumber(2, obj.change, 'USD', 'currency'),
      changePercent: obj.changePercent
        ? `${formatNumber(2, obj.changePercent, 'USD')}%`
        : '',
      dayVolume: formatNumber(0, obj.dayVolume, 'USD'),
      time: obj.time
        ? new Date(new Date().setTime(obj?.time)).toLocaleString()
        : 'No change registered',
      obj: { ...obj },
    }));
    formatedData = [...formatedContent];
  }

  return formatedData;
};
