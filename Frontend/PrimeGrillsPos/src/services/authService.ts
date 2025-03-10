import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export const authService = {
  async login(email: string, password: string) {
    try {
    const response = await axios.post(`${API_URL}/login`, 
      { email, password },
      { withCredentials: true }
    );
    return response.data;
    }
    catch (error) {
      console.error("Login failed:", error);
      
      throw error;
    }
  },

  async logout() {
    const response = await axios.post(`${API_URL}/logout`, {}, 
      { withCredentials: true }
    );
    return response.data;
  }
};
