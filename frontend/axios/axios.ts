import axios from "axios";

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:4001";

// CHANGED: `api` is now for PUBLIC reads only (news, events, public
// innovations/courses listings). No withCredentials, no CSRF header,
// no Authorization header — nothing that forces a CORS preflight.
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// CHANGED (new): `adminApi` carries everything the old shared `api`
// instance used to carry — auth token, cookies, CSRF header — but only
// for admin login/refresh/logout and admin CRUD calls. Update imports in
// axios/api/admin/*.ts to use this instead of `api`.
export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// CHANGED: Authorization header attach logic moved from the old shared
// `api` interceptor to `adminApi` only — public requests no longer carry
// a bearer token or trigger a preflight.
adminApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function refreshSession(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${baseURL}/api/v1/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }
    );
    const newToken = response.data.token;
    setAccessToken(newToken);
    return newToken;
  } catch (error) {
    setAccessToken(null);
    return null;
  }
}

// CHANGED: response interceptor (refresh-on-401 retry logic) moved from
// `api` to `adminApi` — this flow only matters for authenticated admin
// requests, never for public reads.
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(adminApi(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshSession();
        isRefreshing = false;
        if (newToken) {
          onRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return adminApi(originalRequest);
        }
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);