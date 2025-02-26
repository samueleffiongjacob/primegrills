const API_URL = "http://localhost:5000/api/auth";

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const loginUser = async (
  email: string,
  password: string,
  phone?: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, phone }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`);
  }

  return res.json();
};

export const signUpUser = async ({
  username,
  fullName,
  email,
  phoneNumber,
  address,
  password,
}: {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, fullName, email, phoneNumber, address, password }),
  });

  if (!res.ok) {
    throw new Error(`Signup failed: ${res.statusText}`);
  }

  return res.json();
};
