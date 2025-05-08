import React, { useState } from "react";

interface AddressFormProps {
  onAddressSubmit: (address: string) => void;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onAddressSubmit,
  isLoading,
}) => {
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Ethereum address validation
    if (!address) {
      setError("Please enter an Ethereum address");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Invalid Ethereum address format");
      return;
    }

    setError(null);
    onAddressSubmit(address);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title mb-3">Check Ethereum Balances</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Ethereum Address
            </label>
            <input
              type="text"
              className={`form-control ${error ? "is-invalid" : ""}`}
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </>
            ) : (
              "Check Balances"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
