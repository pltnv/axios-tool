import axios from "axios";

const DEFAULT_CONFIG = {
  url: 'https://jsonplaceholder.typicode.com/"',
  headers: {
    accept: "application/json",
  },
};

const DEFAULT_INTERCEPTORS = {
  request: {
    onFulfilled: (config) => config,
    onRejected: (error) => Promise.reject(error),
  },
  response: {
    onFulfilled: (response) => response,
    onRejected: (error) => Promise.reject(error),
  },
};

export function api(
  {
    url = DEFAULT_CONFIG.url,
    headers = {},
    interceptors = DEFAULT_INTERCEPTORS,
  },
  timeout
) {
  const api = axios.create({
    baseURL: url,
    headers: { ...DEFAULT_CONFIG.headers, ...headers },
    ...(timeout && { timeout }),
  });

  api.interceptors.request.use(
    interceptors?.request?.onFulfilled || ((config) => config),
    interceptors?.request?.onRejected || ((error) => Promise.reject(error))
  );
  api.interceptors.response.use(
    interceptors?.response?.onFulfilled || ((response) => response),
    interceptors?.response?.onRejected || ((error) => Promise.reject(error))
  );

  const request = async ({
    method,
    path,
    payload = {},
    query = {},
    signal,
  }) => {
    try {
      return api[method](path, { ...payload, ...query, signal });
    } catch (e) {
      throw e;
    }
  };

  const get = async (path, query, signal) => {
    return request({ method: "get", path, query, signal });
  };

  const post = (path, payload, signal) => {
    return request({ method: "post", path, payload, signal });
  };

  const put = (path, payload, signal) => {
    return request({ method: "put", path, payload, signal });
  };

  const patch = (path, payload, signal) => {
    return request({ method: "patch", path, payload, signal });
  };

  const del = (path, signal) => {
    return request({ method: "delete", path, signal });
  };

  const $get = async (path, query, signal) => {
    const { data } = await get(path, query, signal);
    return data;
  };

  const $post = async (path, payload, signal) => {
    const { data } = await post(path, payload, signal);
    return data;
  };

  const $put = async (path, payload, signal) => {
    const { data } = await put(path, payload, signal);
    return data;
  };

  const $patch = async (path, payload, signal) => {
    const { data } = await patch(path, payload, signal);
    return data;
  };

  return {
    api,
    get,
    post,
    put,
    patch,
    del,
    $get,
    $post,
    $put,
    $patch,
  };
}
