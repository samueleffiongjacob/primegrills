
export const resendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/email/verify/resend/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error resending verification email:', error);
      return { success: false, message: 'Failed to resend verification email' };
    }
  };