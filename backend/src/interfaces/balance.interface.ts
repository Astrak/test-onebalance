export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
}

export interface BalanceResponse {
  address: string;
  date: number;
  balances: TokenBalance[];
}
