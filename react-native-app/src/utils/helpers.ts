
// react-native-app/src/utils/helpers.ts
// Utility functions for the mobile app

export const formatPrice = (price?: number, currency?: string): string => {
  if (price === undefined || price === null) return 'N/A';
  // Basic formatting, consider using a library like `intl` for more robust localization
  return `${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${currency || 'ETH'}`;
};

export const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Add other helper functions (date formatting, string manipulation, etc.)
// Example date formatting (consider using date-fns if you need more complex formatting)
export const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        return 'Invalid Date';
    }
};

    