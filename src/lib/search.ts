import FlexSearch from 'flexsearch';
export function createIndex() {
return new FlexSearch.Index({ tokenize: 'forward' });
}
