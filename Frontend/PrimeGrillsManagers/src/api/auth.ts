const API_URL = "http://localhost:5000/api/auth";

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const loginStaff = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/login-staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`);
  }

  return res.json();
};

