import axios from "axios"
import { URLS } from "../utils/urls.js"

export const createAxiosInstance = (token, urlKey) => axios.create({
    baseURL: URLS[urlKey],
    headers: { 
        'Authorization': token,
        'Content-Type': 'application/json'
    }
})