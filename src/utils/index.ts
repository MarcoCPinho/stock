const base64ToArrayBuffer = (base64: string): Uint8Array => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

const formatNumber = (
  maximumFractionDigits: number,
  style: string,
  value?: number,
  currency = 'USD',
): string => {
  const options = { maximumFractionDigits, style, currency };
  return value ? Intl.NumberFormat('pt-br', options).format(value) : '';
};

export { base64ToArrayBuffer, formatNumber };
