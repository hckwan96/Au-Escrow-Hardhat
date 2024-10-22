import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3421",
});

export default server;