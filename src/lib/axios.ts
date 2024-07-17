import axios from "axios";

const api = axios.create({
  baseURL: "http://ec2-3-93-167-67.compute-1.amazonaws.com/",
  // baseURL: "http://localhost:8000/",
});

export default api;
