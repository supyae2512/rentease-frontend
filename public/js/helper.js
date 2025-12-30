const MAX_SIZE_MB = 1; // 1 MB
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const API_URL = window.APP_CONFIG.BACKEND_URL;
let currentPage = 0;
const pageSize = 10;

const requiredPropertyFields = [
    "#input_title", 
    "#input_city", 
    "#input_property_type", 
    "#input_property_status", 
    "#input_price"
];

const requireAuthentication = () => {
    const token = getCookie("jwt") || localStorage.getItem("jwt_token");
    if (!token) {
        window.location.href = "/signin";
    }
    return token;
};