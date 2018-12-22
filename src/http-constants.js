import axios from 'axios';
var baseURL;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000';
}
else {
    baseURL = 'https://ss.shifumix.com:5000';
}
export var HTTP = axios.create({
    baseURL: baseURL
});
export var ROOT_API = baseURL;
export var VERSION = process.env.version;
console.log("root_api" + baseURL);
console.log("version" + VERSION);
//# sourceMappingURL=http-constants.js.map