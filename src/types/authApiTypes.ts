// Authentication request type
export interface signInRequestType {
  identifier: string; // email (Supabase requires email)
  password: string;
}

// Authentication response type
export interface SignInResponseType {
  token: string; // Supabase access_token (stored in cookies)
}
