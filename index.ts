import axios, { AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

type Method = "get" | "post" | "put" | "patch" | "delete";

type Interceptors<T = InternalAxiosRequestConfig, R = AxiosResponse> = {
  request?: {
    onFulfilled?: (config: T) => T;
    onRejected?: (error: AxiosError) => Promise<AxiosError | never>;
  };
  response?: {
    onFulfilled?: (response: R) => R;
    onRejected?: (error: AxiosError) => Promise<AxiosError | never>;
  };
};

const DEFAULT_CONFIG = {
  url: "https://jsonplaceholder.typicode.com/",
  headers: {
    accept: "application/json",
  },
};

const handleError = (error: AxiosError) => Promise.reject(error);

const createApi = (
  url: string,
  headers: Record<string, string>,
  timeout?: number
) => {
  return axios.create({
    baseURL: url,
    headers: { ...DEFAULT_CONFIG.headers, ...headers },
    ...(timeout && { timeout }),
  });
};

export const api = (
  {
    url = DEFAULT_CONFIG.url,
    headers = {},
    interceptors,
  }: {
    url?: string;
    headers?: Record<string, string>;
    interceptors?: Interceptors;
  },
  timeout?: number
) => {
  const api = createApi(url, headers, timeout);

  api.interceptors.request.use(
    interceptors?.request?.onFulfilled || ((config: InternalAxiosRequestConfig) => config),
    interceptors?.request?.onRejected || handleError
  );
  api.interceptors.response.use(
    interceptors?.response?.onFulfilled || ((response: AxiosResponse) => response),
    interceptors?.response?.onRejected || handleError
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
    payload?: Record<string, unknown>;
    query?: Record<string, unknown>;
    signal?: AbortSignal;
    timeout?: number;
  }) => {
    const config: Partial<AxiosRequestConfig> = {
      signal,
      ...(timeout && { timeout }),
    };

    if (method === "get" || method === "delete") {
      config.params = query;
    } else {
      config.data = payload;
      config.params = query;
    }

    return api[method](path, config);
  };

  const get = async (
    path: string,
    query?: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    return request({ method: "get", path, query, signal, timeout });
  };

  const post = (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    return request({ method: "post", path, payload, signal, timeout });
  };

  const put = (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    return request({ method: "put", path, payload, signal, timeout });
  };

  const patch = (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    return request({ method: "patch", path, payload, signal, timeout });
  };

  const del = (path: string, signal?: AbortSignal, timeout?: number) => {
    return request({ method: "delete", path, signal, timeout });
  };

  const $get = async (
    path: string,
    query?: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    const { data } = await get(path, query, signal, timeout);
    return data;
  };

  const $post = async (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    const { data } = await post(path, payload, signal, timeout);
    return data;
  };

  const $put = async (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    const { data } = await put(path, payload, signal, timeout);
    return data;
  };

  const $patch = async (
    path: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    const { data } = await patch(path, payload, signal, timeout);
    return data;
  };

  const $del = async (
    path: string,
    signal?: AbortSignal,
    timeout?: number
  ) => {
    const { data } = await del(path, signal, timeout);
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
    $del,
  };
};
