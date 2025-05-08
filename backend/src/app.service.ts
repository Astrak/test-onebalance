import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import { BalanceResponse, TokenBalance } from "./interfaces/balance.interface";

// ERC20 ABI for balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

// Token contract addresses on Ethereum mainnet
const TOKEN_CONTRACTS = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Chainlink
};

@Injectable()
export class AppService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    // Initialize provider with a public Ethereum RPC URL
    // For production, use your own Infura/Alchemy API key
    this.provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  }

  async getTokenBalances(address: string): Promise<BalanceResponse> {
    try {
      // Fetch ETH balance
      const ethBalance = await this.provider.getBalance(address);

      // Prepare token balance promises
      const usdcBalancePromise = this.getERC20Balance(
        TOKEN_CONTRACTS.USDC,
        address,
        "USDC"
      );
      const linkBalancePromise = this.getERC20Balance(
        TOKEN_CONTRACTS.LINK,
        address,
        "LINK"
      );

      // Wait for all balances to be fetched
      const [usdcBalance, linkBalance] = await Promise.all([
        usdcBalancePromise,
        linkBalancePromise,
      ]);

      // Create ETH balance object
      const ethTokenBalance: TokenBalance = {
        symbol: "ETH",
        balance: ethBalance.toString(),
        decimals: 18,
        formattedBalance: ethers.formatEther(ethBalance),
      };

      // Return the complete balance response
      return {
        address,
        balances: [ethTokenBalance, usdcBalance, linkBalance],
      };
    } catch (error) {
      console.error("Error fetching balances:", error);
      throw new Error("Failed to fetch token balances");
    }
  }

  private async getERC20Balance(
    contractAddress: string,
    address: string,
    symbol: string
  ): Promise<TokenBalance> {
    try {
      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        this.provider
      );

      // Get token decimals and balance
      const decimals = await contract.decimals();
      const balance = await contract.balanceOf(address);

      return {
        symbol,
        balance: balance.toString(),
        decimals,
        formattedBalance: ethers.formatUnits(balance, decimals),
      };
    } catch (error) {
      console.error(`Error fetching ${symbol} balance:`, error);
      return {
        symbol,
        balance: "0",
        decimals: 0,
        formattedBalance: "0",
      };
    }
  }
}
