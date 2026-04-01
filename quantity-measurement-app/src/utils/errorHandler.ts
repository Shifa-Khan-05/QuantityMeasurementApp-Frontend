import axios, { AxiosError } from 'axios';

// Structured utility for managing backend errors cleanly
export const getBackendErrorMessage = (error: unknown): string => {
  // If no error or weird structure
  if (!error) return 'An unknown error occurred.';

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Check for explicit backend message payload
    const data = axiosError.response?.data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    // Standard HTTP status code mapping
    const status = axiosError.response?.status;
    switch (status) {
      case 400:
        return 'Invalid input. Please check your data.';
      case 401:
        return 'Invalid email or password.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested resource not found.';
      case 409:
        return 'User already exists with this email.';
      case 500:
        return 'Something went wrong. Please try again later.';
      default:
        // Handle no response (Network error / Timeout)
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ECONNREFUSED' || axiosError.message?.includes('Network Error')) {
          return 'Cannot connect to server. Please ensure the backend is running.';
        }
        break;
    }
    
    return axiosError.message || 'An error occurred during communication.';
  }

  // Fallback if the error wasn't an Axios error (e.g. standard Error)
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};
