import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export default apiClient;

//local : http://localhost:5000/api/v1
//render.com : https://sarayu-node-backend-pmuw.onrender.com/api/v1
//aws : http://15.207.132.80:5000/api/v1
