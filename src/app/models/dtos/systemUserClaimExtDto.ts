export interface SystemUserClaimExtDto {
    systemUserClaimId: bigint;
    systemUserId: bigint;
    operationClaimId: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With OperationClaim
    operationClaimName: string;
}