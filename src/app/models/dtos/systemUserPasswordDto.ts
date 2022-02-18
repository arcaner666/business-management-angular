export interface SystemUserPasswordDto {
  systemUserId: bigint;
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}
