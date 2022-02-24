export interface SystemUserDto {
    systemUserId: number;
    email: string;
    phone: string;
    role2: string;
    businessId: number;
    branchId: number;
    blocked: boolean;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
    createdAt: Date;
    updatedAt: Date;
}