interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

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
  const timeout = 8000; // Timeout in 8 seconds)

  const fetchWithTimeout = async (resource: string, options: RequestInit, timeout: number): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId); // Clear the timeout once the fetch is complete
    }
  };

  try {
    const res = await fetchWithTimeout(`${import.meta.env.VITE_BACKEND_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        name: fullName,
        email: email,
        phone: phoneNumber,
        address: address,
        password: password,
      }),
    }, timeout);

    if (!res.ok) {
      // Parse the error response from the server
      const errorResponse = await res.json();
      return {
        success: false,
        message: errorResponse.error || "An unknown error occurred",
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: "Signup successful",
      token: data.token,
    };
  } catch (error: any) {
    // Handle network or unexpected errors
    if (error.name === "AbortError") {
      return {
        success: false,
        message: "The request timed out. Please try again.",
      };
    }
    return {
      success: false,
      message: error.message || "An error occurred while processing your request",
    };
  }
};
