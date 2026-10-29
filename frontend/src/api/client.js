const API_BASE = 'http://localhost:8080/api';

function getHeaders() {
  const token = localStorage.getItem('techplace_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const api = {
  // Auth
  async register(payload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('techplace_token', data.token);
    }
    return data;
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('techplace_token', data.token);
    }
    return data;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('techplace_token');
    }
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(payload) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Dashboard
  async getDashboard() {
    const today = getLocalDateString();
    const res = await fetch(`${API_BASE}/dashboard?today=${today}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async recordStudySession(payload) {
    const res = await fetch(`${API_BASE}/dashboard`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        date: getLocalDateString(),
        ...payload,
      }),
    });
    return handleResponse(res);
  },

  // DSA / Coding Tracker
  async getDsa() {
    const res = await fetch(`${API_BASE}/dsa`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async addDsaProblem(payload) {
    const res = await fetch(`${API_BASE}/dsa`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        datePracticed: getLocalDateString(),
        status: 'Completed',
        ...payload,
      }),
    });
    return handleResponse(res);
  },

  async updateDsaProblem(payload) {
    const res = await fetch(`${API_BASE}/dsa`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteDsaProblem(id) {
    const res = await fetch(`${API_BASE}/dsa?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Core CS
  async getCoreCs() {
    const res = await fetch(`${API_BASE}/core-cs`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async toggleCoreTopic(topicId, completed) {
    const res = await fetch(`${API_BASE}/core-cs/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topicId, completed }),
    });
    return handleResponse(res);
  },

  // Aptitude
  async getAptitude() {
    const res = await fetch(`${API_BASE}/aptitude`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async addAptitudeProblem(payload) {
    const res = await fetch(`${API_BASE}/aptitude`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        datePracticed: getLocalDateString(),
        status: 'Completed',
        ...payload,
      }),
    });
    return handleResponse(res);
  },

  async updateAptitudeProblem(payload) {
    const res = await fetch(`${API_BASE}/aptitude`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteAptitudeProblem(id) {
    const res = await fetch(`${API_BASE}/aptitude?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateAptitudeCount(topicId, count) {
    const res = await fetch(`${API_BASE}/aptitude/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topicId, count: Number(count) }),
    });
    return handleResponse(res);
  },

  // Quiz
  async generateQuiz(topic) {
    const res = await fetch(`${API_BASE}/quiz/generate?topic=${encodeURIComponent(topic || 'core_cs')}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async submitQuiz(payload) {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getQuizHistory() {
    const res = await fetch(`${API_BASE}/quiz/history`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
