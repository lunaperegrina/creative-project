import axios, { AxiosError } from "axios";

const url = process.env.NEXT_PUBLIC_API;

const api = axios.create({
  baseURL: url,
  headers: typeof window !== "undefined" ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {},
});

let isRefreshing = false;
let failedRequestQueue: any[] = [];

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentToken = localStorage.getItem("token");
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        axios
          .post(url + "/auth/refresh", {
            token: currentToken,
          })
          .then((response) => {
            const { access_token } = response.data;
            localStorage.setItem("token", access_token);

            api.defaults.headers["Authorization"] = `Bearer ${access_token}`;

            failedRequestQueue.forEach((request) => request.onSuccess(access_token));
            failedRequestQueue = [];
          })
          .catch((err) => {
            failedRequestQueue.forEach((request) => request.onFailure(err));
            failedRequestQueue = [];
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (token: string) => {
            originalConfig!.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalConfig!));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
