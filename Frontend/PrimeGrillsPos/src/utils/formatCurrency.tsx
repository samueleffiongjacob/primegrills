export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Example usage:
// formatCurrency(1000)     -> "₱1,000.00"
// formatCurrency(1234.56)  -> "₱1,234.56"
// formatCurrency(0.99)     -> "₱0.99"
