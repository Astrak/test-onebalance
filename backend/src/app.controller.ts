import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { AppService } from "./app.service";
import { BalanceResponse } from "./interfaces/balance.interface";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("balance")
  async getBalance(
    @Query("address") address: string
  ): Promise<BalanceResponse> {
    if (!address) {
      throw new BadRequestException("Ethereum address is required");
    }

    // Basic Ethereum address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new BadRequestException("Invalid Ethereum address format");
    }

    return this.appService.getTokenBalances(address);
  }
}
