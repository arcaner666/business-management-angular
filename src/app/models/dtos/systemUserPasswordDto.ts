export interface SystemUserPasswordDto {
  systemUserId: number;
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}
