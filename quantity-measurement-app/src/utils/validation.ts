// Validation utilities for forms
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
  }
  return { isValid: true, message: '' };
};

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { isValid: false, message: 'Phone number must be between 10-15 digits' };
  }
  return { isValid: true, message: '' };
};

export const validateLoginForm = (email: string, password: string) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  return { isValid: true, message: '' };
};

export const validateSignupForm = (name: string, email: string, password: string, mobile: string) => {
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) return nameValidation;

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) return passwordValidation;

  const phoneValidation = validatePhone(mobile);
  if (!phoneValidation.isValid) return phoneValidation;

  return { isValid: true, message: '' };
};