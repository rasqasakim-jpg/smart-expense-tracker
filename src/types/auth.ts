export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    email: string;
    requiresOtp: boolean;
  }
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      fullName: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      fullName: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ValidationError {
  [key: string]: string[];
}