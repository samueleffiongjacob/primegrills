export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

export const getCsrfToken = async (): Promise<string> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf/`, {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.csrfToken;
      }
      return "";
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      return "";
    }
};