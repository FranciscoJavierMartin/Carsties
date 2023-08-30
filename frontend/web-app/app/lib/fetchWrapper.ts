import { getTokenWorkaround } from '@/app/actions/authActions';

const baseUrl = process.env.BACKEND_URL;

async function get(url: string) {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {},
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return await handleResponse(response);
}

async function getHeaders() {
  const token = await getTokenWorkaround();
  const headers: HeadersInit = { 'Content-type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token.access_token}`;
  }

  return headers;
}

async function post(url: string, body: {}) {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return await handleResponse(response);
}

async function put(url: string, body: {}) {
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return await handleResponse(response);
}

async function del(url: string) {
  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: await getHeaders(),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return await handleResponse(response);
}

async function handleResponse(response: Response) {
  const text = await response.text();
  const data = text && JSON.parse(text);

  return response.ok
    ? data || response.statusText
    : {
        status: response.status,
        message: response.statusText,
      };
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
};
