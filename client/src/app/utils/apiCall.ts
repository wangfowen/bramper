import fetch from 'isomorphic-fetch'

interface APICallConfiguration {
  path: string,
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  data?: object,
  apiPath?: string,
  returnText?: boolean
}

const apiCall = async (configuration: APICallConfiguration) => {
  const {
    path,
    method = 'GET',
    data = {},
    apiPath = "api", //make this an environment variable
    returnText = false
  } = configuration;

  const stringifiedData = JSON.stringify(data);

  const response = await fetch(`${apiPath}${path}`, {
    method,
    ...((method !== 'GET') ? {body: stringifiedData} : {}),
    credentials: 'include',
    headers: _getHeaders(),
  });

  if (response.ok) {
    const text = await response.text();
    if (returnText) {
      return text
    } else {
      return text ? JSON.parse(text) : {}
    }
  } else {
    throw (await response.json())
  }
};

const _getHeaders = () => {
  const authToken = localStorage.token;
  return {
    ...(authToken !== null ? { Authorization: 'Bearer ' + authToken } : {}),
    ...{
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
};

export default apiCall;
