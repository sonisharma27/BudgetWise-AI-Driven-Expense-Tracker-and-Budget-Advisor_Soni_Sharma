import axios from "axios";

const API_URL = "http://localhost:8081";

export const registerUser = (user) => {
    return axios.post(`${API_URL}/users/register`, user);
};

export const loginUser = (credentials) => {
    return axios.post(`${API_URL}/users/login`, credentials);
};
