export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

export const ROLE_MAP: Record<string, string> = {
  'super-admin': 'Super Admin',
  'operations-admin': 'Operations Admin',
  'moderator': 'Moderator',
  'content-manager': 'Content Manager',
  'support-agent': 'Support Agent',
  'finance': 'Finance',
  'analyst': 'Analyst',
};

export function getAuthToken(): string | null {
  return localStorage.getItem('jobrisers_admin_token');
}

export function setAuthSession(
  token: string,
  admin: { id?: string; name?: string; email?: string; role?: string }
): void {
  localStorage.setItem('jobrisers_admin_auth', 'true');
  localStorage.setItem('jobrisers_admin_token', token);
  localStorage.setItem('jobrisers_admin_email', admin.email || '');
  localStorage.setItem('jobrisers_admin_role', admin.role || '');
  localStorage.setItem('jobrisers_admin_name', admin.name || '');
  localStorage.setItem('jobrisers_admin_user', JSON.stringify(admin));
}

export function clearAuthSession(): void {
  localStorage.setItem('jobrisers_admin_auth', 'false');
  localStorage.removeItem('jobrisers_admin_token');
  localStorage.removeItem('jobrisers_admin_email');
  localStorage.removeItem('jobrisers_admin_role');
  localStorage.removeItem('jobrisers_admin_name');
  localStorage.removeItem('jobrisers_admin_user');
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
}

export interface AdminIdentity {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
}

export interface CurrentAdminResponse {
  success: boolean;
  admin?: AdminIdentity;
  message?: string;
}

export async function getCurrentAdmin(): Promise<CurrentAdminResponse | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await apiFetch('/api/auth/me');
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        clearAuthSession();
      }
      return null;
    }
    const data: CurrentAdminResponse = await res.json();
    if (data && data.success && data.admin) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCandidates(queryParams: Record<string, any> = {}): Promise<{
  success: boolean;
  data: any[];
  pagination: { page: number; limit: number; totalRecords: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'All' && value !== 'All statuses' && value !== 'All locations' && value !== 'All sources') {
      searchParams.set(key, String(value));
    }
  }
  const queryStr = searchParams.toString();
  const endpoint = `/api/admin/candidates${queryStr ? `?${queryStr}` : ''}`;
  const res = await apiFetch(endpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch candidates: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCandidateById(id: string): Promise<any> {
  const res = await apiFetch(`/api/admin/candidates/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch candidate ${id}: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

export async function unmaskCandidatePii(id: string, justification: string): Promise<any> {
  const res = await apiFetch(`/api/admin/candidates/${id}/unmask-pii`, {
    method: 'POST',
    body: JSON.stringify({ justification }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to unmask candidate PII');
  }
  return res.json();
}

export async function updateCandidateStatus(id: string, status: string, reason?: string): Promise<any> {
  const res = await apiFetch(`/api/admin/candidates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update candidate status');
  }
  return res.json();
}

export async function addCandidateNote(id: string, note: string): Promise<any> {
  const res = await apiFetch(`/api/admin/candidates/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to add caseworker note');
  }
  return res.json();
}

