export interface AuthorizationDto {
  systemUserId: number;
  email: string; 
  phone: string;
  role: string;
  businessId: number;
  branchId: number;
  blocked: boolean;
  refreshToken: string;
  refreshTokenExpiryTime: Date;
  createdAt: Date;
  updatedAt: Date;

  // Extended
  password: string;
  refreshTokenDuration: number;
  accessToken: string;
}
