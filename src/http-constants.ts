import axios from 'axios'

let baseURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/'
} else {
    baseURL = 'http://socketserver.shifumix.com:5000/'
}

export const HTTP = axios.create(
{
        baseURL: baseURL
})