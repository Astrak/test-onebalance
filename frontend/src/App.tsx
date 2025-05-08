import React, { useState } from "react";
import axios from "axios";
import AddressForm from "./components/AddressForm";
import BalanceCard from "./components/BalanceCard";
import { BalanceResponse, TokenBalance } from "./types/balance.types";

const API_URL = "http://localhost:3001/api";

function App() {
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<BalanceResponse>(`${API_URL}/balance`, {
        params: { address },
      });

      setBalanceData(response.data);
    } catch (err) {
      console.error("Error fetching balance data:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to fetch balances");
      } else {
        setError("Network error or server unavailable");
      }
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <header className="text-center mb-5">
            <h1 className="mb-3">Ethereum Balance Checker</h1>
          </header>

          <AddressForm onAddressSubmit={fetchBalances} isLoading={loading} />

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {balanceData && (
            <div className="mt-4">
              <div className="row">
                {balanceData.balances.map((balance: TokenBalance) => (
                  <div className="col-md-4" key={balance.symbol}>
                    <BalanceCard balance={balance} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
