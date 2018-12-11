import axios from 'axios'

let baseURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'https://localhost:5000/'
    //baseURL = "http://45.77.160.220:5000"
} else {
    baseURL = 'https://ss.shifumix.com:5000/'
}

export const HTTP = axios.create({
        baseURL: baseURL
});

export const ROOT_API=baseURL;