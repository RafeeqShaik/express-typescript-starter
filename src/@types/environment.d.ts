declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      API_PREFIX: string;
      DATABASE: string;
      NODE_ENV: 'development' | 'production';
      'JWT-SECRET': string;
      OTP_EXPIRY_IN_SECONDS: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
