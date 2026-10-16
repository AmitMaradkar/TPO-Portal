const API_BASE_URL =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:8080";

export default API_BASE_URL;

