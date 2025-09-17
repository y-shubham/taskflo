import axios from "axios"
const instance = axios.create({
  baseURL: "https://taskflo-backend.onrender.com/api",
});
export default instance