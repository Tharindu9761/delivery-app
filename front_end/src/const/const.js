// Utility function to generate full URLs
const generateUrl = (path) => `http://localhost:3000/api/${path}`;

// Users URL
export const CREATE_USER = generateUrl("users");
export const LOGIN_WEB = generateUrl("users/web_login");

// For actions that require an ID in the URL, use a template string function
export const UPDATE_USER = (id) => generateUrl(`users/${id}`);
export const DELETE_USER = (id) => generateUrl(`users/${id}`);
export const FIND_USER = (id) => generateUrl(`users/${id}`);
export const RESET_PASSWORD_BY_ID = (id) =>
  generateUrl(`users/reset_password_id/${id}`);
export const PIC_THUMB = (id) => generateUrl(`users/thumb/${id}`);
export const PIC_FULL = (id) => generateUrl(`users/full/${id}`);
