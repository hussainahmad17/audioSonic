import axios from "axios";

// Allow Vercel/production to set the API origin while keeping local dev working
const envApiBase = import.meta.env?.VITE_API_BASE_URL;
const isLocal = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);
const resolvedApiBase =
  (typeof envApiBase === "string" && envApiBase.trim()) ||
  (isLocal ? "http://localhost:8000/api" : `${window.location.origin}/api`);

export const API_BASE_URL = resolvedApiBase.replace(/\/$/, "");
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");
export const MEDIA_BASE_URL =
  (import.meta.env?.VITE_MEDIA_BASE_URL &&
    import.meta.env.VITE_MEDIA_BASE_URL.trim()) ||
  `${API_ORIGIN}/uploads`;
let _audioBase =
  (import.meta.env?.VITE_AUDIO_BASE_URL &&
    import.meta.env.VITE_AUDIO_BASE_URL.trim()) ||
  API_ORIGIN;

// If frontend is served on localhost (Vite dev) and audio base accidentally resolves
// to the frontend origin, prefer the backend API origin to avoid serving index.html
if (typeof window !== "undefined") {
  try {
    if (
      window.location.hostname &&
      /localhost|127\.0\.0\.1/.test(window.location.hostname) &&
      _audioBase === window.location.origin
    ) {
      _audioBase = API_ORIGIN;
    }
  } catch (e) {
    // ignore
  }
}

export const AUDIO_BASE_URL = _audioBase;

// Debug: show resolved endpoints in the browser console during development
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.log("[ApiCalls] API_BASE_URL:", API_BASE_URL);
  // eslint-disable-next-line no-console
  console.log("[ApiCalls] AUDIO_BASE_URL:", AUDIO_BASE_URL);
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


// export async function postRequest(url, params) {
//   try {
//     const response = await apiClient.post(url, params);
//     return response.data;
//   } catch (error) {
//     console.error("POST request failed:", error);
//     throw error;
//   }
// }


// export function postRequest(url, params, callback, errorCallback) {
//   axios
//     .post(API_BASE_URL + url, params, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     .then((response) => {
//       if (callback) callback(response.data);
//     })
//     .catch((error) => {
//       if (errorCallback) errorCallback(error);
//     });
// }



export function postRequest(url, params, callback, errorCallback, headers = {}) {
  axios
    .post(API_BASE_URL + url, params, {
      headers: {
        ...(params instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    })
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

// export function postRequest(url, params, callback, errorCallback) {
//   axios
//     .post(API_BASE_URL + url, params, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     .then((response) => {
//       if (callback) {
//         callback(response);
//       }
//     })
//     .catch((error) => {
//       if (errorCallback) {
//         errorCallback(error);
//       }
//     });
// }

// export async function postRequest(url, params) {
//   try {
//     const response = await axios.post(API_BASE_URL + url, params);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Something went wrong" };
//   }
// }


export async function getRequest(url) {
  try {
    const response = await axios.get(API_BASE_URL + url);
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}



export async function putRequest(url, params, callback, errorCallback) {
  try {
    const response = await axios.put(API_BASE_URL + url, params);
    if (callback) callback(response);
    return response.data;
  } catch (error) {
    if (errorCallback) errorCallback(error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
}

// export function putRequest(url, params, callback, errorCallback) {
//   axios
//     .put(API_BASE_URL + url, params)
//     .then((response) => {
//       if (callback) {
//         callback(response);
//       }
//     })
//     .catch((error) => {
//       if (errorCallback) {
//         errorCallback(error);
//       }
//     });
// }


// Add PUT request function
// export function putRequest(url, params, callback, errorCallback) {
//   apiClient
//     .put(url, params)
//     .then((response) => {
//       if (callback) {
//         callback(response);
//       }
//     })
//     .catch((error) => {
//       if (errorCallback) {
//         errorCallback(error);
//       }
//     });
// }

// export function getRequest(url, callback, errorCallback) {
//   apiClient
//     .get(url)
//     .then((response) => {
//       if (callback) {
//         callback(response);
//       }
//     })
//     .catch((error) => {
//       if (errorCallback) {
//         errorCallback(error);
//       }
//     });
// }


export async function deleteRequest(url) {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error;
  }
}

export { apiClient };
