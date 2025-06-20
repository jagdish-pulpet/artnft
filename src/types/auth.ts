
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
  avatarUrl?: string;
  coverUrl?: string; // Added
  bio?: string; // Added
  socialLinks?: { // Added
    twitter?: string;
    instagram?: string;
    website?: string;
    discord?: string;
  };
  walletAddress: string; // Added, assuming it comes from /auth/me
  isEmailVerified?: boolean; // Added
  isWalletVerified?: boolean; // Added
  isSuspended?: boolean; // Added
  createdAt?: string; // Added
  lastLoginAt?: string; // Added
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin?: boolean, originalMessage?: string) => Promise<void>;
  signup: (username: string, email: string, password_unused: string, walletAddress: string) => Promise<void>;
  logout: () => void;
  refreshAuthUser: () => Promise<void>; // Added
}
