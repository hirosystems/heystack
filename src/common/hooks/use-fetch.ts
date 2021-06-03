import * as pack from '../../../package.json';

const hiroHeaders: HeadersInit = {
  'x-hiro-product': pack.name,
  'x-hiro-version': pack.version,
};

export function useFetch(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  return fetch(input, { ...init, headers: { ...initHeaders, ...hiroHeaders } });
}
