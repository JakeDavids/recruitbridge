// /components/utils/apiFetch.js

// Robust fetch helper with proper error handling
async function fetchJson(url, init = {}) {
  const res = await fetch(url, { credentials: 'include', ...init });
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  let data = null;
  
  if (ct.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Ignore JSON parse errors, data stays null
    }
  }
  
  if (!res.ok) {
    console.error('[threads api] error', { url, status: res.status, ct, text });
    throw new Error(data?.detail || `HTTP ${res.status}`);
  }
  
  return data ?? {};
}

export async function apiFetch(path, init = {}) {
  // Always call the mounted Base44 functions path
  const url = path.replace(/^\/api\/threads\//, "/functions/api/threads/");
  return fetchJson(url, init);
}