// Utility function to generate full URLs using the new ngrok link
const generateUrl = (path) => `https://elegant-probably-beetle.ngrok-free.app/api/${path}`;
//ngrok http --domain=elegant-probably-beetle.ngrok-free.app 3000

// Users URL
export const CREATE_USER = generateUrl('users');
export const LOGIN_MOBILE = generateUrl('users/mobile_login');

// For actions that require an ID in the URL, use a template string function
export const UPDATE_USER = id => generateUrl(`users/${id}`);
export const DELETE_USER = id => generateUrl(`users/${id}`);
export const FIND_USER = id => generateUrl(`users/${id}`);
export const PIC_THUMB = id => generateUrl(`users/thumb/${id}`);
export const PIC_FULL = id => generateUrl(`users/full/${id}`);
