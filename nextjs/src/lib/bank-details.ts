/**
 * EFT banking details shown on /checkout/success and in order confirmation emails.
 * Override in production with EFT_* env vars if details change (no secrets here — public payment info).
 */
export type EftBankDetails = {
  bank: string;
  accountName: string;
  accountNo: string;
  branchCode: string;
  accountType: string;
};

export function getEftBankDetails(): EftBankDetails {
  return {
    bank: process.env.EFT_BANK_NAME?.trim() || "Nedbank",
    accountName: process.env.EFT_ACCOUNT_NAME?.trim() || "LAVA VIDE SA (PTY) LTD",
    accountNo: process.env.EFT_ACCOUNT_NUMBER?.trim() || "1123920508",
    branchCode: process.env.EFT_BRANCH_CODE?.trim() || "198765",
    accountType: process.env.EFT_ACCOUNT_TYPE?.trim() || "Cheque / Current",
  };
}
