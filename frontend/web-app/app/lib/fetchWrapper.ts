const baseUrl = process.env.BACKEND_URL;

async function get(url: string) {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {},
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
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
};
