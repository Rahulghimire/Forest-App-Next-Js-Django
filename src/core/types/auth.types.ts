export interface LoginResponseDTO {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  tenant_id: any;
  password_changed: boolean;
}
