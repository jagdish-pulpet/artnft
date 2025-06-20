
// react-native-app/src/hooks/useToast.ts
import Toast from 'react-native-toast-message';

interface ToastOptions {
  type?: 'success' | 'error' | 'info';
  text1?: string; // Title
  text2?: string; // Message
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  props?: any;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
}

interface UseToastReturn {
  showToast: (options: ToastOptions) => void;
  // You can add hideToast or other methods if needed
}

export const useToast = (): UseToastReturn => {
  const showToast = (options: ToastOptions) => {
    const { 
      type = 'info', 
      text1, 
      text2, 
      visibilityTime = 4000, 
      autoHide = true, 
      ...rest 
    } = options;

    Toast.show({
      type,
      text1,
      text2,
      visibilityTime,
      autoHide,
      ...rest,
    });
  };

  return { showToast };
};
