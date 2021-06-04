import { atom } from 'jotai';
import { debounce } from 'ts-debounce';

const giphySearchUrl = 'https://api.giphy.com/v1/gifs/search?api_key=';
const API_KEY = 'YgPXheG6YuQ9DzWoYsVYooZepqy0ezii';

const fetchGiphy = debounce(async (query: string) => {
  const url = `${giphySearchUrl}${API_KEY}&q=${query.replace(' ', '+')}`;
  const res = await fetch(url);
  const results = await res.json();
  return results.data;
}, 500);

export const gihpyQueryAtom = atom('simpsons');

export const gihpyResultsAtom = atom(async get => {
  const query = get(gihpyQueryAtom);
  if (query === '' || !query) return;
  return fetchGiphy(query);
});
