// Backend connection testing utility
import api from '../services/api';

export interface BackendTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const testBackendConnection = async (): Promise<BackendTestResult> => {
  try {
    console.log("🧪 Testing backend connection...");

    // Test basic connectivity
    const response = await api.get('/health');

    return {
      success: true,
      message: "Backend is responding",
      details: {
        status: response.status,
        data: response.data
      }
    };
  } catch (error: any) {
    console.error("Backend connection test failed:", error);

    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: "Backend server is not running or not accessible",
        details: {
          error: "Connection refused",
          suggestion: "Start your Spring Boot application"
        }
      };
    }

    if (error.response) {
      return {
        success: false,
        message: `Backend responded with error: ${error.response.status}`,
        details: {
          status: error.response.status,
          data: error.response.data
        }
      };
    }

    return {
      success: false,
      message: "Cannot connect to backend server",
      details: {
        error: error.message,
        suggestion: "Check if backend is running on http://localhost:8080"
      }
    };
  }
};

export const testAuthEndpoints = async (): Promise<{
  register: BackendTestResult;
  login: BackendTestResult;
}> => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "TestPassword123",
    mobile: "1234567890"
  };

  console.log("🧪 Testing auth endpoints...");

  // Test register endpoint
  let registerResult: BackendTestResult;
  try {
    const registerResponse = await api.post('/auth/register', testUser);
    registerResult = {
      success: true,
      message: "Register endpoint working",
      details: registerResponse.data
    };
  } catch (error: any) {
    registerResult = {
      success: false,
      message: `Register endpoint failed: ${error.response?.status || error.message}`,
      details: error.response?.data || error.message
    };
  }

  // Test login endpoint
  let loginResult: BackendTestResult;
  try {
    const loginResponse = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    loginResult = {
      success: true,
      message: "Login endpoint working",
      details: loginResponse.data
    };
  } catch (error: any) {
    loginResult = {
      success: false,
      message: `Login endpoint failed: ${error.response?.status || error.message}`,
      details: error.response?.data || error.message
    };
  }

  return { register: registerResult, login: loginResult };
};

// Debug utility to log current configuration
export const logFrontendConfig = () => {
  console.log("🔧 Frontend Configuration:");
  console.log("   API Base URL:", import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");
  console.log("   Environment:", import.meta.env.MODE);
  console.log("   Auth Token Present:", !!localStorage.getItem('authToken'));
  console.log("   User Name:", localStorage.getItem('loggedInName') || 'Not set');
};