export interface SystemUserClaimExtDto {
    systemUserClaimId: number;
    systemUserId: number;
    operationClaimId: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With OperationClaim
    operationClaimName: string;
}