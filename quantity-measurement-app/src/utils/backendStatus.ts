// Backend error message utility
export const getBackendErrorMessage = (error: any): string => {
  if (error?.response?.status === 500) {
    return 'Server error. Please check your backend server.';
  }

  if (error?.response?.status === 404) {
    return 'API endpoint not found. Please contact support.';
  }

  if (error?.response?.status === 401) {
    return 'Authentication failed. Please login again.';
  }

  if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
    return 'Cannot connect to server. Please ensure the backend is running.';
  }

  if (error?.response?.status === 403) {
    return 'Access denied. You do not have permission.';
  }

  return error?.response?.data?.message ||
         error?.response?.data?.error ||
         error?.message ||
         'An error occurred. Please try again.';
};