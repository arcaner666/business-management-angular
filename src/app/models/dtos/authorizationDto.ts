import { Role } from "src/app/models/various/role";

export interface AuthorizationDto {
  systemUserId: bigint;
  email: string; 
  phone: string;
  role2: string;
  dateOfBirth: Date;
  businessId: number;
  branchId: bigint;
  blocked: boolean;
  refreshToken: string;
  refreshTokenExpiryTime: Date;
  createdAt: Date;
  updatedAt: Date;

  // Extended
  password: string;
  refreshTokenDuration: number;
  accessToken: string;
  role: Role;
}
