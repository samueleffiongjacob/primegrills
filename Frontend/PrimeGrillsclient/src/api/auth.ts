
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      username: username, 
      name: fullName, 
      email: email, 
      phone: phoneNumber, 
      address: address, 
      password: password })
  });

  if (!res.ok) {
    throw new Error(`Signup failed: ${res.statusText}`);
  }

  return res.json();
};
