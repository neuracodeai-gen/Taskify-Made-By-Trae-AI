import CryptoJS from 'crypto-js';

const SECRET_KEY = 'taskify-local-secret-key'; // In a real app, this wouldn't be here like this for client-side only

export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePasswordStrength = (password) => {
  // At least 8 chars, 1 letter, 1 number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};
