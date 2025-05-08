import React from "react";
import { TokenBalance } from "../types/balance.types";
import { show4SignificantDigits } from "../utils/show4SignificantDigits";

interface BalanceCardProps {
  balance: TokenBalance;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const { symbol, formattedBalance } = balance;

  // Determine card styling based on token symbol
  const getCardStyles = () => {
    switch (symbol) {
      case "ETH":
        return {
          bgColor: "bg-primary text-white",
          icon: "💎",
        };
      case "USDC":
        return {
          bgColor: "bg-info text-white",
          icon: "💵",
        };
      case "LINK":
        return {
          bgColor: "bg-warning",
          icon: "🔗",
        };
      default:
        return {
          bgColor: "bg-light",
          icon: "🪙",
        };
    }
  };

  const { bgColor, icon } = getCardStyles();

  return (
    <div className={`card ${bgColor} mb-3`}>
      <div className="card-body">
        <h5 className="card-title">
          {icon} {symbol}
        </h5>
        <p className="card-text fs-4">
          {show4SignificantDigits(formattedBalance)}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
