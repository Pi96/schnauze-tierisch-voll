export const API_BASE = import.meta.env.PUBLIC_API_BASE || '';


export async function fetchList(path = '/') {
const url = `${API_BASE}/api/list?path=${encodeURIComponent(path)}`;
const res = await fetch(url);
if (!res.ok) throw new Error('List fetch failed');
return res.json();
}


export async function fetchLatest(limit = 10) {
const url = `${API_BASE}/api/latest?limit=${limit}`;
const res = await fetch(url);
if (!res.ok) throw new Error('Latest fetch failed');
return res.json();
}
