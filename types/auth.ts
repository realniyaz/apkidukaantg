export interface RegisterPayload {
  owner_name: string;
  email: string;
  password: string;
  shop_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
