export interface User {
  public_id: string
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}
