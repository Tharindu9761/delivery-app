// Utility function to generate full URLs
const generateUrl = (path) => `http://192.168.0.51:3000/api/${path}`;

// Users URL
export const CREATE_USER = generateUrl('users');
export const LOGIN_MOBILE = generateUrl('users/mobile_login');

// For actions that require an ID in the URL, use a template string function
export const UPDATE_USER = (id) => generateUrl(`users/${id}`);
export const DELETE_USER = (id) => generateUrl(`users/${id}`);
export const FIND_USER = (id) => generateUrl(`users/${id}`);

