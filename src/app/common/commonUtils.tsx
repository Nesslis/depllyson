import { encode } from 'qss';

export const encodeQuery = (params: object, prefix = '?') => {
  const queryParams = encode(params);
  if (!queryParams) return '';
  return prefix + queryParams;
};
