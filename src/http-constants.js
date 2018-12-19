import axios from 'axios';
let baseURL;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000';
}
else {
    baseURL = 'https://ss.shifumix.com:5000';
}
export const HTTP = axios.create({
    baseURL: baseURL
});
export const ROOT_API = baseURL;
export const VERSION = process.env.version;
console.log("root_api" + baseURL);
console.log("version" + VERSION);
//# sourceMappingURL=http-constants.js.map