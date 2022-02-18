export interface SystemUserDto {
    systemUserId: bigint;
    email: string;
    phone: string;
    role2: string;
    businessId: number;
    branchId: bigint;
    blocked: boolean;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
    createdAt: Date;
    updatedAt: Date;
}