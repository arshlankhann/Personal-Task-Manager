const BASE_URL = 'http://localhost:5000/api/tasks';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const taskApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    const query = params.toString();
    return fetch(`${BASE_URL}${query ? `?${query}` : ''}`).then(handleResponse);
  },

  getById: (id) => fetch(`${BASE_URL}/${id}`).then(handleResponse),

  create: (task) =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handleResponse),

  update: (id, updates) =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse),

  toggle: (id) =>
    fetch(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' }).then(handleResponse),

  reorder: (orderedIds) =>
    fetch(`${BASE_URL}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    }).then(handleResponse),
};
