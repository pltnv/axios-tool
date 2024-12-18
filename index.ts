import axios, { AxiosResponse, AxiosError } from "axios";

type Method = "get" | "post" | "put" | "patch" | "delete";

type Interceptors<T = any, R = AxiosResponse> = {
  request?: {
    onFulfilled?: (config: T) => T;
    onRejected?: (error: AxiosError) => Promise<any>;
  };
  response?: {
    onFulfilled?: (response: R) => R;
    onRejected?: (error: AxiosError) => Promise<any>;
  };
};

const DEFAULT_CONFIG = {
  url: "https://jsonplaceholder.typicode.com/",
  headers: {
    accept: "application/json",
  },
};

const DEFAULT_INTERCEPTORS: Interceptors = {
  request: {
    onFulfilled: (config) => config,
    onRejected: (error) => Promise.reject(error),
  },
  response: {
    onFulfilled: (response) => response,
    onRejected: (error) => Promise.reject(error),
  },
};

export const api = (
  {
    url = DEFAULT_CONFIG.url,
    headers = {},
    interceptors = DEFAULT_INTERCEPTORS,
  }: {
    url?: string;
    headers?: Record<string, string>;
    interceptors?: Interceptors;
  },
  timeout?: number
) => {
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
    timeout,
  }: {
    method: Method;
    path: string;
    payload?: Record<string, any>;
    query?: Record<string, any>;
    signal?: AbortSignal;
    timeout?: number;
  }) => {
    try {
      return api[method](path, {
        ...payload,
        ...query,
        signal,
        ...(timeout && { timeout }),
      });
    } catch (e) {
      throw e;
    }
  };

  const get = async (
    path: string,
    query?: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    return request({ method: "get", path, query, signal, timeout });
  };

  const post = (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    return request({ method: "post", path, payload, signal, timeout });
  };

  const put = (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    return request({ method: "put", path, payload, signal, timeout });
  };

  const patch = (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    return request({ method: "patch", path, payload, signal, timeout });
  };

  const del = (path: string, signal?: any, timeout?: number) => {
    return request({ method: "delete", path, signal, timeout });
  };

  const $get = async (
    path: string,
    query?: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    const { data } = await get(path, query, signal);
    return data;
  };

  const $post = async (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    const { data } = await post(path, payload, signal);
    return data;
  };

  const $put = async (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
    const { data } = await put(path, payload, signal);
    return data;
  };

  const $patch = async (
    path: string,
    payload: Record<string, any>,
    signal?: any,
    timeout?: number
  ) => {
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
};
