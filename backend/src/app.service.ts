import { Injectable, Logger } from "@nestjs/common";
import { ethers } from "ethers";
import { BalanceResponse, TokenBalance } from "./interfaces/balance.interface";
import { CacheService } from "./cache.service";

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
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Chainlink
};

@Injectable()
export class AppService {
  private provider: ethers.JsonRpcProvider;
  private readonly logger = new Logger(AppService.name);

  constructor(private cacheService: CacheService) {
    this.provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  }

  async getTokenBalances(address: string): Promise<BalanceResponse> {
    try {
      // Try to get from cache first
      const cacheKey = `balances:${address}`;
      const cachedValue = await this.cacheService.get<BalanceResponse>(
        cacheKey
      );

      if (cachedValue !== null) {
        this.logger.debug(`Cache hit for address: ${address}`);
        return cachedValue;
      }

      this.logger.debug(
        `Cache miss for address: ${address}, fetching from blockchain`
      );

      // Fetch ETH balance
      const ethBalance = await this.provider.getBalance(address);

      // Prepare token balance promises
      const usdcBalancePromise = this.getERC20Balance(
        TOKEN_CONTRACTS.USDT,
        address,
        "USDT"
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
        // Convert BigInt to string to make it serializable
        balance: ethBalance.toString(),
        decimals: 18,
        formattedBalance: ethers.formatEther(ethBalance),
      };

      // Return the complete balance response
      const balanceResponse = {
        address,
        date: Date.now(),
        balances: [ethTokenBalance, usdcBalance, linkBalance],
      };

      // Store in cache with 60 second TTL
      this.cacheService
        .set(cacheKey, balanceResponse, 60)
        .catch((err) =>
          this.logger.error(
            `Failed to cache balance for ${address}: ${err.message}`
          )
        );

      return balanceResponse;
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
        // Convert BigInt to string to make it serializable
        balance: balance.toString(),
        // Convert decimals to number if it's a BigInt
        decimals: typeof decimals === "bigint" ? Number(decimals) : decimals,
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
