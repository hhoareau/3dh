import axios from 'axios'

let baseURL;

export const CONFIG=require("../package.json");

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000'
} else {
    baseURL = CONFIG.root_api;
}

export const HTTP = axios.create({
    baseURL: baseURL
});

export const ROOT_API=baseURL;

console.log("root_api:"+baseURL);