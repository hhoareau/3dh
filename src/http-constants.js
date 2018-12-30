import axios from 'axios';
var baseURL;
export var CONFIG = require("../package.json");
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000';
}
else {
    baseURL = CONFIG.root_api;
}
export var HTTP = axios.create({
    baseURL: baseURL
});
export var ROOT_API = baseURL;
console.log("root_api:" + baseURL);
//# sourceMappingURL=http-constants.js.map