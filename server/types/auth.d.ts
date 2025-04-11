export interface AuthPayload {
  userId: number;
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
}
